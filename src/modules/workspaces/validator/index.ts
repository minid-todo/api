import type { Context, Next } from 'hono';
import { ValidationError } from 'yup';
import { Responder } from '../../../libs';
import type {
  ICreateWorkspaceRequestBody,
  IUpdateWorkspaceRequestBody,
} from '../../../types';
import {
  createWorkspaceValidatorSchema,
  updateWorkspaceRequestParamValidatorSchema,
} from './schema';

export const createWorkspaceValidator = async (c: Context, next: Next) => {
  const reqBody = await c.req.json<ICreateWorkspaceRequestBody>();
  // Validate Param
  try {
    await createWorkspaceValidatorSchema.validate(reqBody);
  } catch (error) {
    if (error instanceof ValidationError) {
      return new Responder(c).badRequest(error.message);
    }
    throw error;
  }
  await next();
};

export const updateWorkspaceValidator = async (c: Context, next: Next) => {
  const reqBody = await c.req.json<IUpdateWorkspaceRequestBody>();
  const workspace_uid = c.req.param('workspace_uid');
  // Validate Param
  try {
    await createWorkspaceValidatorSchema.validate(reqBody);
    await updateWorkspaceRequestParamValidatorSchema.validate({
      workspace_uid,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return new Responder(c).badRequest(error.message);
    }
    throw error;
  }
  await next();
};
