import { bool, object, string } from 'yup';
import type {
  ICreateProjectRequestBody,
  IUpdateProjectRequestBody,
  IUpdateProjectRequestParam,
} from '../../../types';

export const createProjectValidatorSchema =
  object<ICreateProjectRequestBody>().shape({
    workspace_uid: string().required(),
    name: string().optional(),
    description: string().optional(),
  });

export const updateProjectRequestBodyValidatorSchema =
  object<IUpdateProjectRequestBody>().shape({
    workspace_uid: string().optional(),
    owner_uid: string().optional(),
    name: string().required(),
    description: string().optional(),
    is_archived: bool().optional(),
  });

export const updateProjectRequestParamValidatorSchema =
  object<IUpdateProjectRequestParam>().shape({
    project_uid: string().required(),
  });
