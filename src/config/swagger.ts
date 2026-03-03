import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QuickHire API Documentation',
      version: '1.0.0',
      description: 'RESTful API for QuickHire Job Board Application',
      contact: {
        name: 'API Support',
        email: 'support@quickhire.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api`,
        description: 'Development server',
      },
      {
        url: 'https://api.quickhire.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Job: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            company: { type: 'string' },
            location: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            requirements: { type: 'array', items: { type: 'string' } },
            salary: { type: 'string' },
            type: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Application: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            jobId: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            resumeLink: { type: 'string' },
            coverNote: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            stack: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/routes/*.ts', './src/modules/**/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
