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
  config.CORS_ORIGIN.split(",")
    .map((origin) => toOrigin(origin))
    .filter((origin): origin is string => Boolean(origin)),
);

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
      if (normalizedOrigin && allowedOrigins.has(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  skip: () => config.NODE_ENV === "development",
});
app.use("/api", limiter);

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
