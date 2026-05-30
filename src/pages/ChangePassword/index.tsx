import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Input, Form, Modal, Row, Col } from 'antd';
import { useAppDispatch } from '../../store/hooks';
import { changePassword } from '../../store/auth';
import { customHistory } from '../../routes/History';
import { clearLocalStorage } from '../../utils/general';
import PageTitle from '../../components/PageTitle';
import Button from '../../components/Button';
import CCard from '../../components/CCard';
import Success from '../../assets/svg/Success.svg?react';
import ChangePassword from '../../assets/svg/ChangePassword.svg?react';
import styles from './styles.module.scss';

const App = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const PasswordChangeSchema = Yup.object().shape({
    oldPassword: Yup.string().required(t('errorOldPassword')),
    newPassword: Yup.string().required(t('errorNewPassword')),
  });

  const logout = () => {
    clearLocalStorage();
    customHistory.push('/auth/login');
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    const responseChangePassword = await dispatch(changePassword({ ...values }));
    if (responseChangePassword?.payload?.success) {
      setIsModalVisible(true);
      resetForm();
      logout();
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <PageTitle title={t('changePassword')} svg={<ChangePassword />} />
      <section className={styles['c-changePassword']}>
        <Formik initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }} validationSchema={PasswordChangeSchema} onSubmit={handleSubmit}>
          {({ errors, touched, values, setFieldValue, handleSubmit }) => (
            <Form name='change-password' layout='vertical' onFinish={handleSubmit}>
              <CCard paddingOn className={styles['c-changePassword__card']}>
                <Row align={'top'} gutter={36}>
                  <Col span={24}>
                    <Form.Item
                      label={t('oldPassword')}
                      validateStatus={errors.oldPassword && touched.oldPassword ? 'error' : ''}
                      help={errors.oldPassword && touched.oldPassword ? errors.oldPassword : null}>
                      <Field name='oldPassword'>
                        {({ field }: any) => <Input.Password {...field} autoComplete='off' value={values.oldPassword} onChange={(e) => setFieldValue('oldPassword', e.target.value)} />}
                      </Field>
                    </Form.Item>
                  </Col>
                </Row>
                <Row align={'middle'} gutter={36}>
                  <Col span={24}>
                    <Form.Item
                      label={t('newPassword')}
                      validateStatus={errors.newPassword && touched.newPassword ? 'error' : ''}
                      help={errors.newPassword && touched.newPassword ? errors.newPassword : null}>
                      <Field name='newPassword'>
                        {({ field }: any) => <Input.Password {...field} autoComplete='off' value={values.newPassword} onChange={(e) => setFieldValue('newPassword', e.target.value)} />}
                      </Field>
                    </Form.Item>
                  </Col>
                </Row>
                <Row align={'middle'} gutter={36}>
                  <Col span={24} className={styles['c-changePassword__button']}>
                    <Button type={'primary'} text={t('submitChangePassword')} handleClick={handleSubmit} />
                  </Col>
                </Row>
              </CCard>
            </Form>
          )}
        </Formik>
        <Modal title={t('successModalTitle')} visible={isModalVisible} onOk={handleOk} onCancel={handleOk}>
          <div className={styles['modal-wrapper']}>
            <Success />
            <p>{t('successChangePassword')}</p>
          </div>
        </Modal>
      </section>
    </>
  );
};

export default App;
