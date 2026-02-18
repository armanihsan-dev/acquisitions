import logger from '#config/logger.js';
import aj from '#config/arcjet.js';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';
    console.log('Security middleware hit:', req.path);

    let limit;

    switch (role) {
      case 'admin':
        limit = 15;
        break;
      case 'user':
        limit = 10;
        break;
      case 'guest':
        limit = 5;
        break;
    }
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

    const decision = await aj.protect(req);
    console.log('Decision:', JSON.stringify(decision, null, 2));
    console.log('Is denied?', decision.isDenied());
    console.log('Conclusion:', decision.conclusion);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield Blocked request', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by security policy',
      });
    }

    if (decision.isDenied()) {
      if (
        decision.reason.isRateLimit?.() ||
        decision.reason.type === 'RATE_LIMIT'
      ) {
        logger.warn('Rate limit exceeded', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          path: req.path,
        });

        return res
          .status(429)
          .json({ error: 'Forbidden', message: 'Too many requests' });
      }
    }

    next();
  } catch (e) {
    console.error('Arcjet middleware error:', e);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong with security middleware',
    });
  }
};
export default securityMiddleware;
