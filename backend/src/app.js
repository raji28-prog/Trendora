import env from './config/env.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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

// ── CORS ──────────────────────────────────────────────────────────────────────
// In production: allow only the deployed frontend URL.
// In development: allow all origins (Vite dev server).
const allowedOrigins = env.NODE_ENV === 'production' && env.FRONTEND_URL
  ? [env.FRONTEND_URL]
  : true; // true = reflect request Origin (any origin) — safe for dev

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ── Body parsers (generous limit for base64 image payloads) ───────────────────
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

// NOTE: /uploads static file serving has been removed.
// All images are now served via Cloudinary CDN URLs stored in the database.

// ── Route Mounts ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

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

app.use('/api/health', healthRouter);

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Express Error:', err);

  if (err?.code === 'P2010' || err?.constructor?.name === 'PrismaClientKnownRequestError') {
    const meta = err?.meta?.message || '';
    const isConnectivity =
      meta.includes('Server selection timeout') ||
      meta.includes('InternalError') ||
      meta.includes('I/O error');

    if (isConnectivity) {
      return res.status(503).json({
        success: false,
        error: { statusCode: 503, message: 'Database is temporarily unavailable. Please try again shortly.' },
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

  if (err?.constructor?.name === 'PrismaClientInitializationError') {
    return res.status(503).json({
      success: false,
      error: { statusCode: 503, message: 'Database connection could not be established.' },
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: { statusCode, message: err.message || 'Internal Server Error' },
  });
});

export default app;
