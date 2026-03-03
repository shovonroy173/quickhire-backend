import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import { config } from "./config/env";
import { connectDatabase } from "./config/database";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
// import { logger } from "./config/logger";

const app = express();
const toOrigin = (value: string): string | null => {
  try {
    const parsed = new URL(value.trim());
    return `${parsed.protocol}//${parsed.host}`;   
  } catch {
    return null;
  }
};

const allowedOrigins = new Set(
  config.CORS_ORIGIN.split(',')
    .map((origin) => toOrigin(origin))
    .filter((origin): origin is string => Boolean(origin)),
);

const isTrustedVercelOrigin = (origin: string): boolean => {
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    return (
      /^quickhire-frontend(?:-[a-z0-9-]+)?\.vercel\.app$/.test(hostname) ||
      /^quickhire-admin(?:-[a-z0-9-]+)?\.vercel\.app$/.test(hostname)
    );
  } catch {
    return false;
  }
};

if (config.NODE_ENV === "development") {
  allowedOrigins.add("http://localhost:3000");
  allowedOrigins.add("http://localhost:3001");
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://localhost:5174");
  allowedOrigins.add("http://127.0.0.1:3000");
  allowedOrigins.add("http://127.0.0.1:3001");
  allowedOrigins.add("http://127.0.0.1:5173");
  allowedOrigins.add("http://127.0.0.1:5174");
}

// Connect to database
connectDatabase();

// Required when deployed behind reverse proxies (Vercel/Render/Nginx)
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = toOrigin(origin);
      if (normalizedOrigin && (allowedOrigins.has(normalizedOrigin) || isTrustedVercelOrigin(normalizedOrigin))) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

// Smart rate limiting
const isDev = () => config.NODE_ENV === "development";
const isReadMethod = (method: string) =>
  method === "GET" || method === "HEAD" || method === "OPTIONS";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: "Too many authentication requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: isDev,
});

const authMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many login/register attempts from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDev() || isReadMethod(req.method),
});

const publicReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  message: "Too many read requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDev() || !isReadMethod(req.method),
});

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 80,
  message: "Too many write requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) =>
    isDev() ||
    isReadMethod(req.method) ||
    req.path.startsWith("/auth"),
});

// Route-aware limits
app.use("/api/auth", authLimiter);
app.use("/api/auth/login", authMutationLimiter);
app.use("/api/auth/register", authMutationLimiter);
app.use("/api/auth/refresh-token", authMutationLimiter);

// Public jobs read endpoints can be hit frequently from home/list pages
app.use("/api/jobs", publicReadLimiter);

// Writes are intentionally stricter to protect server resources
app.use("/api", writeLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression
app.use(compression());

// Logging
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// API routes
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => {
  // logger.info("Health check endpoint accessed" , req);
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
