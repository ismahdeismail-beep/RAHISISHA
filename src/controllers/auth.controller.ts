import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../utils/response-handler';
import { generateApiKey } from '../utils/id-generator';

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, businessName, phone } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const apiKey = generateApiKey();

      // Implementation would save to database
      successResponse(res, {
        message: 'Registration successful',
        apiKey,
      }, 201);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      // Implementation would verify credentials
      const token = jwt.sign(
        { userId: 'user_id', email },
        process.env.JWT_SECRET!,
        { expiresIn: (process.env.JWT_EXPIRY || '24h') as any }
      );

      successResponse(res, { token });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const newToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        process.env.JWT_SECRET!,
        { expiresIn: (process.env.JWT_EXPIRY || '24h') as any }
      );
      successResponse(res, { token: newToken });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      successResponse(res, { message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Implementation would fetch user profile
      successResponse(res, { profile: {} });
    } catch (error) {
      next(error);
    }
  };
}