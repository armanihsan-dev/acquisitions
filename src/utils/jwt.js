import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || '@@JWT_SECRET@@1122';
const EXPIRATION_TIME = '1d';

export const jwtToken = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRATION_TIME });
    } catch (error) {
      logger.error('Error signing JWT token: ', error);
      throw new Error('Failed to Sign the token');
    }
  },
  verify: token => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Error verifying JWT token: ', error);
      throw new Error('Failed to Verify the token');
    }
  },
};
