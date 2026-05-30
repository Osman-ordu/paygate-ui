import * as Yup from 'yup';
import { LoginFormProps } from '../../../../dbProps';

export const LoginInitialValues = (): LoginFormProps => {
  return <LoginFormProps>{
    email: '',
    password: '',
  };
};

export const LoginValidationSchema = Yup.object({
  email: Yup.string().trim().required('email').email('Invalid email'),
  password: Yup.string().trim().required('password'),
});
