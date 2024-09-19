import type { Schema } from 'mongoose';

export interface IUsers {
  uuid: string;
  username: string;
  password: string;
  active_status: boolean;
  password_reset_token: string;
  password_reset_token_expiry: Date;
  topup_flag: boolean;
  last_login_at: Date;
  last_logout_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ITenant {
  uuid: string;
  name: string;
  code: string;
  active_status: boolean;
  owner: Schema.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

export interface IWorkspace {
  uuid: string;
  tenant_id: Schema.Types.ObjectId;
  workspace_type: Schema.Types.ObjectId;
  name: string;
  active_status: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IWorkspaceType {
  uuid: string;
  name: string;
  config: {
    file_upload_size: number;
    project_limit: number;
    history_limit: number;
    people_limit: number;
  };
  description: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface IProjects {
  uuid: string;
  name: string;
  description: string;
  is_default: boolean;
  workspace_id: Schema.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

export interface ITodos {
  uuid: string;
  owner_id: Schema.Types.ObjectId;
  name: string;
  description: string;
  comments: [
    {
      user_id: Schema.Types.ObjectId;
      comment: string;
      created_at: Date;
      updated_at: Date;
    },
  ];
  due_date: Date;
  completed: boolean;
  priority: number;
  project_id: Schema.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}
