import type { Context, Next } from 'hono';
import { ValidationError } from 'yup';
import { Responder } from '../../../libs';
import type { IRegisterRequest, IloginRequest } from '../../../types';
import {
  getUserValidatorSchema,
  loginValidatorSchema,
  registerValidatorSchema,
} from './schema';

export const getUserValidator = async (c: Context, next: Next) => {
  // Get Query parameter user_id from request query parameters
  const user_id = c.req.query('user_id');

  // Validate Param
  try {
    await getUserValidatorSchema.validate({ user_id });
  } catch (error) {
    if (error instanceof ValidationError) {
      return new Responder(c).badRequest(error.message);
    }
    throw error;
  }

  await next();
};

export const loginValidator = async (c: Context, next: Next) => {
  // Get Query parameter user_id from request query parameters
  const reqBody = await c.req.json<IloginRequest>();

  // Validate Param
  try {
    await loginValidatorSchema.validate(reqBody);
  } catch (error) {
    if (error instanceof ValidationError) {
      return new Responder(c).badRequest(error.message);
    }
    throw error;
  }

  await next();
};

export const registerValidator = async (c: Context, next: Next) => {
  // Implement logic to create a new user in the database
  const reqBody = await c.req.json<IRegisterRequest>();

  // Validate Param
  try {
    await registerValidatorSchema.validate(reqBody);
  } catch (error) {
    if (error instanceof ValidationError) {
      return new Responder(c).badRequest(error.message);
    }
    throw error;
  }

  await next();
};
