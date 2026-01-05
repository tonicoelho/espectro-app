/**
 * Espectro API Server
 * Brazilian News Bias Tracker - Backend
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: API_VERSION,
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes (will be imported from routes/)
app.get(`/api/${API_VERSION}/`, (_req: Request, res: Response) => {
  res.json({
    message: 'Espectro API - Brazilian News Bias Tracker',
    version: API_VERSION,
    endpoints: {
      health: '/health',
      stories: `/api/${API_VERSION}/stories`,
      sources: `/api/${API_VERSION}/sources`,
      trending: `/api/${API_VERSION}/stories/trending`,
    },
    documentation: 'https://github.com/your-repo/espectro-app',
  });
});

// TODO: Import routes
// import storiesRouter from './routes/stories';
// import sourcesRouter from './routes/sources';
// import whatsappRouter from './routes/whatsapp';
// app.use(`/api/${API_VERSION}/stories`, storiesRouter);
// app.use(`/api/${API_VERSION}/sources`, sourcesRouter);
// app.use(`/api/${API_VERSION}/whatsapp`, whatsappRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🇧🇷 Espectro API Server                                ║
║   Brazilian News Bias Tracker                            ║
║                                                          ║
║   Environment: ${process.env.NODE_ENV || 'development'}
║   Port: ${PORT}
║   API Version: ${API_VERSION}
║                                                          ║
║   Health: http://localhost:${PORT}/health
║   API: http://localhost:${PORT}/api/${API_VERSION}/
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

export default app;
