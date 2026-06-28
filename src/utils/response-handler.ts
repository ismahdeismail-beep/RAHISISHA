import { Response } from 'express';
import { ApiResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function successResponse<T>(res: Response, data: T, statusCode: number = 200, meta?: Record<string, any>): Response {
  const response: ApiResponse<T> = {
    success: true, data,
    meta: { timestamp: new Date().toISOString(), requestId: uuidv4(), ...meta },
  };
  return res.status(statusCode).json(response);
}

export function errorResponse(res: Response, message: string, code: string = 'INTERNAL_ERROR', statusCode: number = 500, details?: Record<string, any>): Response {
  const response: ApiResponse = {
    success: false,
    error: { code, message, details },
    meta: { timestamp: new Date().toISOString(), requestId: uuidv4() },
  };
  return res.status(statusCode).json(response);
}

export function paginatedResponse<T>(res: Response, data: T[], page: number, limit: number, total: number): Response {
  const totalPages = Math.ceil(total / limit);
  return successResponse(res, data, 200, {
    page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1,
  });
}