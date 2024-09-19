import { boolean, date, number, object, string } from 'yup';
import type {
  ICreateTodoRequest,
  IUpdateTodoRequestBody,
  IUpdateTodoRequestParam,
} from '../../../types';

export const createTodoValidatorSchema = object<ICreateTodoRequest>().shape({
  project_uid: string().optional(),
  name: string().required(),
  description: string().optional(),
  priority: number().optional(),
});

export const updateTodoRequestBodyValidatorSchema =
  object<IUpdateTodoRequestBody>().shape({
    project_uid: string().optional(),
    name: string().optional(),
    description: string().optional(),
    priority: number().optional(),
    start_date: date().optional(),
    end_date: date().optional(),
    is_completed: boolean().optional(),
    is_deleted: boolean().optional(),
  });

export const updateTodoRequestParamValidatorSchema =
  object<IUpdateTodoRequestParam>().shape({
    todo_uid: string().required(),
  });
