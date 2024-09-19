import type { Context, Next } from 'hono';
import { ValidationError } from 'yup';
import { Responder } from '../../../libs';
import type {
  ICreateProjectRequestBody,
  IUpdateProjectRequestBody,
} from '../../../types';
import {
  createProjectValidatorSchema,
  updateProjectRequestParamValidatorSchema,
} from './schema';


export const createProjectValidator = async (c: Context, next: Next) => {
  const reqBody = await c.req.json<ICreateProjectRequestBody>();
  // Validate Param
  try {
    await createProjectValidatorSchema.validate(reqBody);
  } catch (error) {
    if (error instanceof ValidationError) {
      return new Responder(c).badRequest(error.message);
    }
    throw error;
  }
  await next();
};

export const updateProjectValidator = async (c: Context, next: Next) => {
  const reqBody = await c.req.json<IUpdateProjectRequestBody>();
  const project_uid = c.req.param('project_uid');
  // Validate Param
  try {
    await createProjectValidatorSchema.validate(reqBody);
    await updateProjectRequestParamValidatorSchema.validate({ project_uid });
  } catch (error) {
    if (error instanceof ValidationError) {
      return new Responder(c).badRequest(error.message);
    }
    throw error;
  }
  await next();
};
