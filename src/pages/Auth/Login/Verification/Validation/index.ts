import * as Yup from 'yup';
import { VerifyProps } from '../../../../../dbProps';

export const verifyInitialValues = (): VerifyProps => {
  return {
    code: '',
  };
};

export const verifyValidationSchema = Yup.object().shape({
  code: Yup.string().required('code'),
});
