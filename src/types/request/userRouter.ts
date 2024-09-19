export interface IRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IGetUserRequest {
  user_id: string | undefined;
}

export interface IloginRequest {
  email: string;
  password: string;
}
