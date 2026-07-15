import env from './config/env.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

// Routes imports
import healthRouter from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import businessRoutes from './routes/business.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import adRoutes from './routes/ad.routes.js';
import campaignRoutes from './routes/campaign.routes.js';
import leadRoutes from './routes/lead.routes.js';
import posterRoutes from './routes/poster.routes.js';
import reviewRoutes from './routes/review.routes.js';
import serviceRoutes from './routes/service.routes.js';
import schedulerRoutes from './routes/scheduler.routes.js';
import teamRoutes from './routes/team.routes.js';
import billingRoutes from './routes/billing.routes.js';
import aiRoutes from './routes/ai.routes.js';
import gbpRoutes from './routes/gbp.routes.js';
import studioRoutes from './routes/studio.routes.js';
import instagramRoutes from './routes/instagram.routes.js';
import socialAccountsRoutes from './routes/social-accounts.routes.js';

const app = express();

// Configure CORS
app.use(cors({
  origin: true,
  credentials: true,
}));

// Body parsers with limits for base64 uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

// Custom Static files serving for uploaded assets
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
}));

// Route Mounts
app.use('/api/auth', authRoutes);

// Support both singular and plural endpoint patterns
app.use('/api/businesses', businessRoutes);
app.use('/api/business', businessRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.use('/api/ads', adRoutes);
app.use('/api/ad', adRoutes);

app.use('/api/campaigns', campaignRoutes);
app.use('/api/campaign', campaignRoutes);

app.use('/api/leads', leadRoutes);
app.use('/api/lead', leadRoutes);

app.use('/api/posters', posterRoutes);
app.use('/api/poster', posterRoutes);

app.use('/api/reviews', reviewRoutes);
app.use('/api/review', reviewRoutes);

// Phase 4 & 5 Routes
app.use('/api/services', serviceRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/services/categories', serviceRoutes);
app.use('/api/services/packages', serviceRoutes);

app.use('/api/scheduler', schedulerRoutes);
app.use('/api/posts', schedulerRoutes);

app.use('/api/team', teamRoutes);
app.use('/api/team-members', teamRoutes);

app.use('/api/billing', billingRoutes);
app.use('/api/subscriptions', billingRoutes);

app.use('/api/ai', aiRoutes);

app.use('/api/gbp', gbpRoutes);

app.use('/api/studio', studioRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/social-accounts', socialAccountsRoutes);

// Health check endpoint
app.use('/api/health', healthRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Express Error:', err);

  // ── Prisma / MongoDB connection errors ───────────────────────────────────
  // Prisma error code P2010 = raw query failed (includes Atlas connectivity)
  // Prisma error code P2025 = record not found
  if (err?.code === 'P2010' || err?.constructor?.name === 'PrismaClientKnownRequestError') {
    const meta = err?.meta?.message || '';
    const isConnectivity =
      meta.includes('Server selection timeout') ||
      meta.includes('InternalError') ||
      meta.includes('I/O error');

    if (isConnectivity) {
      return res.status(503).json({
        success: false,
        error: {
          statusCode: 503,
          message: 'Database is temporarily unavailable. Please try again shortly.',
        },
      });
    }

    if (err?.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: { statusCode: 404, message: 'Record not found.' },
      });
    }

    return res.status(500).json({
      success: false,
      error: { statusCode: 500, message: 'A database error occurred.' },
    });
  }

  // ── PrismaClientInitializationError (can't connect at all) ───────────────
  if (err?.constructor?.name === 'PrismaClientInitializationError') {
    return res.status(503).json({
      success: false,
      error: {
        statusCode: 503,
        message: 'Database connection could not be established.',
      },
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      statusCode,
      message: err.message || 'Internal Server Error',
    },
  });
});

export default app;
