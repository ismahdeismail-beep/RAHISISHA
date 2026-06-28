import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../types';

export const validatePayment = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    provider: Joi.string().valid('braintree', 'mpesa', 'pesapal', 'wallet', 'bank').required(),
    paymentMethod: Joi.string().required(),
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).uppercase(),
    orderId: Joi.string().required(),
    customerId: Joi.string(),
    phoneNumber: Joi.string().when('provider', { is: 'mpesa', then: Joi.required() }),
    customerEmail: Joi.string().email(),
    paymentNonce: Joi.string().when('provider', { is: 'braintree', then: Joi.required() }),
    description: Joi.string().max(500),
    metadata: Joi.object(),
  });
  const { error } = schema.validate(req.body);
  if (error) { const details: Record<string, string> = {}; error.details.forEach((detail) => { details[detail.path[0]] = detail.message; }); throw new ValidationError('Validation failed', details); }
  next();
};

export const validateEscrow = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    sellerId: Joi.string().required(),
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).uppercase().default('KES'),
    description: Joi.string().required().max(500),
    milestones: Joi.array().items(Joi.object({ description: Joi.string().required(), amount: Joi.number().positive().required(), dueDate: Joi.date().iso() })),
    inspectionPeriod: Joi.number().integer().min(1).max(30).default(3),
  });
  const { error } = schema.validate(req.body);
  if (error) { const details: Record<string, string> = {}; error.details.forEach((detail) => { details[detail.path[0]] = detail.message; }); throw new ValidationError('Validation failed', details); }
  next();
};