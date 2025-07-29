import { Express, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Rate limiting configurations
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute for sensitive endpoints
  message: {
    error: 'Rate limit exceeded for sensitive operations.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Remove powered by header
  res.removeHeader('X-Powered-By');
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "media-src 'self' https:; " +
    "connect-src 'self' wss: https:; " +
    "font-src 'self'; " +
    "frame-src 'none';"
  );
  
  next();
}

// Input sanitization middleware
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Basic XSS prevention for string inputs
  function sanitizeString(str: string): string {
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+\s*=/gi, '');
  }

  function sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  }

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
}

// Error handler that doesn't leak information
export function secureErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Server error:', err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse = {
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  };

  res.status(err.status || 500).json(errorResponse);
}

// Admin authentication middleware
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user is admin (add admin role check here)
  if (req.user && req.user.username === 'admin') {
    return next();
  }

  return res.status(403).json({ error: 'Admin access required' });
}

// CSRF protection setup (basic implementation)
export function setupCSRF(app: Express) {
  // Generate CSRF token
  app.use('/api', (req, res, next) => {
    if (!req.session.csrfToken) {
      req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
    }
    next();
  });

  // Provide CSRF token endpoint
  app.get('/api/csrf-token', (req, res) => {
    res.json({ token: req.session.csrfToken });
  });

  // Validate CSRF token on state-changing operations
  app.use(['/api/*/create', '/api/*/update', '/api/*/delete'], (req, res, next) => {
    const token = req.headers['x-csrf-token'] || req.body.csrfToken;
    
    if (!token || token !== req.session.csrfToken) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    
    next();
  });
}

export function setupSecurity(app: Express) {
  // Apply security headers
  app.use(securityHeaders);
  
  // Apply input sanitization
  app.use(sanitizeInput);
  
  // Apply rate limiting
  app.use('/api/', apiLimiter);
  app.use('/api/login', authLimiter);
  app.use('/api/register', authLimiter);
  
  // Setup CSRF protection
  setupCSRF(app);
  
  // Apply secure error handling
  app.use(secureErrorHandler);
}