import type { Context, Next } from 'hono';
import { ValidationError } from 'yup';
import { Responder } from '../../../libs';
import type {
  ICreateTodoRequest,
  IUpdateTodoRequestBody,
} from '../../../types';
import {
  createTodoValidatorSchema,
  updateTodoRequestBodyValidatorSchema,
  updateTodoRequestParamValidatorSchema,
} from './schema';

export const createTodoValidator = async (c: Context, next: Next) => {
  // Get Query parameter user_id from request query parameters
  const { name, description, priority, project_uid } =
    await c.req.json<ICreateTodoRequest>();

  // Validate Param
  try {
    await createTodoValidatorSchema.validate({
      name,
      description,
      priority,
      project_uid,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return new Responder(c).badRequest(error.message);
    }
    throw error;
  }

  await next();
};

export const updateTodoValidator = async (c: Context, next: Next) => {
  // Get Query parameter user_id from request query parameters
  const { name, description, priority } =
    await c.req.json<IUpdateTodoRequestBody>();

  const todo_uid = c.req.param('todo_uid');

  // Validate Param
  try {
    await updateTodoRequestBodyValidatorSchema.validate({
      name,
      description,
      priority,
    });
    await updateTodoRequestParamValidatorSchema.validate({ todo_uid });
  } catch (error) {
    if (error instanceof ValidationError) {
      return new Responder(c).badRequest(error.message);
    }
    throw error;
  }

  await next();
};
