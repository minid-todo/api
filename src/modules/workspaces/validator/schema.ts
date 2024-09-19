import { bool, number, object, string } from 'yup';
import type {
  ICreateWorkspaceRequestBody,
  IUpdateWorkspaceRequestBody,
  IUpdateWorkspaceRequestParam,
} from '../../../types';

export const createWorkspaceValidatorSchema =
  object<ICreateWorkspaceRequestBody>().shape({
    tenent_uid: string().required(),
    name: string().optional(),
    description: string().optional(),
  });

export const updateWorkspaceRequestBodyValidatorSchema =
  object<IUpdateWorkspaceRequestBody>().shape({
    tenent_uid: string().optional(),
    owner_id: number().optional(),
    name: string().optional(),
    description: string().optional(),
    is_archived: bool().optional(),
  });

export const updateWorkspaceRequestParamValidatorSchema =
  object<IUpdateWorkspaceRequestParam>().shape({
    workspace_id: string().required(),
  });
