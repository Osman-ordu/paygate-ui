import { useEffect, useRef } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../../store/hooks';
import ButtonArea from '../../../../components/ButtonArea';
import CErrorMessage from '../../../../components/CErrorMessage';
import { VerifyFormProps, VerifyProps } from '../../../../dbProps';
import { loginVerify } from '../../../../store/auth';
import { verifyInitialValues, verifyValidationSchema } from './Validation';
import styles from './styles.module.scss';

const VerifyForm: React.FC<VerifyFormProps> = ({ onClose, onFormReset, shouldResetForm, emailProp }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formikRef = useRef<FormikProps<VerifyProps>>(null);

  const handleSubmit = async (data: VerifyProps, { resetForm }: any) => {
    await dispatch(loginVerify({ email: emailProp, code: data.code }));

    resetForm();
    onFormReset();
    onClose();
  };

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  return (
    <section className={styles['c-verify-form']}>
      <Formik
        key={Math.random()}
        innerRef={formikRef}
        initialValues={verifyInitialValues()}
        validationSchema={verifyValidationSchema}
        validateOnChange={true}
        onSubmit={handleSubmit}
        validateOnBlur={true}>
        {({ values, setFieldValue, errors, handleSubmit }) => (
          <Form name='verify' layout='vertical' onFinish={handleSubmit}>
            <Row align={'top'} gutter={36} className={styles['c-verify-form__row']}>
              <Col span={24}>
                <Form.Item name='code' required>
                  <div className={styles['c-verify-form__code-container']}>
                    <div className={styles['c-verify-form__code-label']}>{t('google_auth_code')}</div>
                    <Input
                      className={styles['c-verify-form__code-input']}
                      required
                      type='text'
                      placeholder={t('please_enter_google_verification')}
                      value={values.code}
                      onChange={(event) => setFieldValue('code', event.target.value)}
                      maxLength={6}
                    />
                  </div>
                </Form.Item>
                <CErrorMessage errorMessage={errors.code} />
              </Col>
              <Col span={24}>
                <ButtonArea cancelClick={() => onClose()} submitTitle='confirm' />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </section>
  );
};
export default VerifyForm;
