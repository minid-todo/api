export interface ICreateTodoRequest {
  project_uid: string | undefined;
  name: string;
  description: string;
  priority: number | null;
}

export interface IUpdateTodoRequestParam {
  todo_uid: string;
}

export interface IUpdateTodoRequestBody {
  project_uid: string | undefined;
  owner_uid: string | undefined;
  name: string | undefined;
  description: string | undefined;
  priority: number | undefined;
  start_date: string | undefined;
  end_date: string | undefined;
  is_completed: boolean | undefined;
  is_deleted: boolean | undefined;
}

export interface ICreateProjectRequestBody {
  workspace_uid: string;
  name: string;
  description: string | undefined;
}

export interface IUpdateProjectRequestParam {
  project_uid: string;
}

export interface IUpdateProjectRequestBody {
  workspace_uid: string | undefined;
  owner_uid: string | undefined;
  name: string | undefined;
  description: string | undefined;
  is_default: boolean | undefined;
  is_archived: boolean | undefined;
}

export interface ICreateWorkspaceRequestBody {
  tenent_uid: string | undefined;
  name: string;
  description: string | undefined;
}

export interface IUpdateWorkspaceRequestParam {
  workspace_uid: string;
}

export interface IUpdateWorkspaceRequestBody {
  tenent_uid: string | undefined;
  owner_uid: string | undefined;
  name: string | undefined;
  description: string | undefined;
  is_archived: boolean | undefined;
}
