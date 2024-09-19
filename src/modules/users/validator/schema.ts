import { object, ref, string } from 'yup';

export const getUserValidatorSchema = object().shape({
  user_id: string().required(),
});

export const loginValidatorSchema = object().shape({
  email: string().required(),
  password: string().required(),
});

export const registerValidatorSchema = object().shape({
  email: string().required(),
  password: string().required(),
  confirm_password: string()
    .required()
    .oneOf([ref('password')], 'Passwords must match'),
});
