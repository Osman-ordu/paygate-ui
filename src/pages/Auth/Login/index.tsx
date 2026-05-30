import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Input } from 'antd';
import { Formik, FormikProps } from 'formik';
import { useAppDispatch } from '../../../store/hooks';
import { login } from '../../../store/auth';
import { LoginFormProps } from '../../../dbProps';
import MainLayout from '../../../layout/MainLayout/MainLayout';
import Button from '../../../components/Button';
import CErrorMessage from '../../../components/CErrorMessage';
import CustomModal from '../../../components/Modal';
import { LoginInitialValues, LoginValidationSchema } from './Validation';
import VerifyForm from './Verification';

function LoginForm() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formikRef = useRef<FormikProps<LoginFormProps>>(null);

  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);

  const submitHandler = async (values: LoginFormProps) => {
    const loginStepOne = await dispatch(login({ ...values }));
    if (loginStepOne.payload.success === true && loginStepOne.payload.data === true) {
      setIsVerifyModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsVerifyModalVisible(false);
  };

  return (
    <MainLayout>
      <CustomModal title={t('security_verification')} isVisible={isVerifyModalVisible} onClose={() => setIsVerifyModalVisible(false)} width={550} centered={true}>
        <VerifyForm shouldResetForm={shouldResetForm} onFormReset={() => setShouldResetForm(false)} onClose={handleCloseModal} emailProp={formikRef.current?.values.email} />
      </CustomModal>
      {!isVerifyModalVisible && (
        <Formik
          innerRef={formikRef}
          initialValues={LoginInitialValues()}
          validationSchema={LoginValidationSchema}
          onSubmit={submitHandler}
          validateOnChange={true}
          validateOnBlur={true}
          validator={() => ({})}>
          {({ values, setFieldValue, errors, handleSubmit }) => (
            <Card key='' title={t('login')}>
              <Form style={{ width: 500 }} name='login_request' layout='vertical' onFinish={handleSubmit}>
                <Form.Item name='email' label={t('email')}>
                  <Input required type='text' placeholder={t('email')} value={values.email} onChange={(event) => setFieldValue('email', event.target.value)} />
                  <CErrorMessage errorMessage={errors.email} />
                </Form.Item>
                <Form.Item name='password' label={t('password')}>
                  <Input.Password required placeholder={t('password')} type='password' value={values.password} onChange={(event) => setFieldValue('password', event.target.value)} />
                  <CErrorMessage errorMessage={errors.password} />
                </Form.Item>
                <Form.Item>
                  <Button text='login' position='right' htmlType='submit' type='primary' handleClick={handleSubmit} />
                </Form.Item>
              </Form>
            </Card>
          )}
        </Formik>
      )}
    </MainLayout>
  );
}

export default LoginForm;
