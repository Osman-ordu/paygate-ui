import * as Yup from 'yup';
import { UpdateBankCredentialsProps } from '../../../dbProps';

export const createValidationSchema = (t: (key: string) => string) => {
  return Yup.object().shape({
    user_name: Yup.string().test('user-password-match', t('user_password_required'), function (value) {
      const { password } = this.parent;
      if (!value && !password) return true;
      if (value && password) return true;
      if (value && !password) return false;
      return true;
    }),
    password: Yup.string().test('password-user-match', t('password_user_required'), function (value) {
      const { user_name } = this.parent;
      if (!value && !user_name) return true;
      if (value && user_name) return true;
      if (value && !user_name) return false;
      return true;
    }),
    to_user_name: Yup.string().test('tos-user-password-match', t('tos_user_password_required'), function (value) {
      const { to_password } = this.parent;
      if (!value && !to_password) return true;
      if (value && to_password) return true;
      if (value && !to_password) return false;
      return true;
    }),
    to_password: Yup.string().test('tos-password-user-match', t('tos_password_user_required'), function (value) {
      const { to_user_name } = this.parent;
      if (!value && !to_user_name) return true;
      if (value && to_user_name) return true;
      if (value && !to_user_name) return false;
      return true;
    }),
    type: Yup.string().required('Type is required'),
  });
};

export const AddInitialValue = (data: any): UpdateBankCredentialsProps => {
  return <UpdateBankCredentialsProps>{
    user_name: data?.userName || '',
    password: data?.password || '',
    real_sender_name: data?.realSenderName || '',
    api_url: data?.apiUrl || '',
    second_api_url: data?.secondApiUrl || '',
    to_user_name: data?.toUserName || '',
    to_password: data?.toPassword || '',
    account_no: data?.accountNo || '',
    api_key: data?.apiKey || '',
    secret_key: data?.secretKey || '',
    type: data?.type || '',
    passPhrase: data?.passPhrase || '',
    cointr_tos_password: data?.tosPassword || '',
    okx_tos_password: data?.tosPassword || '',
  };
};
