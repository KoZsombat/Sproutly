import rateLimit from 'express-rate-limit';

const safeIpKey = (req) => {
  const ip =
    req?.ip || req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress;
  return typeof ip === 'string' ? ip.replace(/:\d+[^:]*$/, '') : 'unknown';
};

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later',
  keyGenerator: safeIpKey,
  validate: { xForwardedForHeader: false, default: false },
});

export const apiLimiter = rateLimit({
  windowMs: 5 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later',
  keyGenerator: safeIpKey,
  validate: { xForwardedForHeader: false, default: false },
});

export const loginLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  keyGenerator: safeIpKey,
  validate: { xForwardedForHeader: false, default: false },
});

export const registerLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: 'Too many registration attempts, please try again later',
  keyGenerator: safeIpKey,
  validate: { xForwardedForHeader: false, default: false },
});

export const reqLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  message: 'Too many requests, please try again later',
  keyGenerator: safeIpKey,
  validate: { xForwardedForHeader: false, default: false },
});
