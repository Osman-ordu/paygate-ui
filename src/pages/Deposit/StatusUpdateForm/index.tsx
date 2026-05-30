import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { Form, Select, Row, Col, Input } from 'antd';
import { useAppDispatch } from '../../../store/hooks';
import { updateDepositStatus } from '../../../store/deposit';
import { transactionStatusEnum, refundStatusEnum } from '../../../db/Enums';
import { StatusUpdateInitialValues, StatusUpdateValidationSchema } from '../Validation';
import CCard from '../../../components/CCard';
import Button from '../../../components/Button';
import CErrorMessage from '../../../components/CErrorMessage';
import { StatusUpdateFormProps } from '../../../dbProps';
import styles from './styles.module.scss';

export default function StatusUpdateForm({ depositId, onClose, onSuccess }: { depositId: string; onClose: () => void; onSuccess?: () => void }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formikRef = useRef<FormikProps<StatusUpdateFormProps>>(null);

  const submitHandler = async (values: any) => {
    const result = await dispatch(updateDepositStatus({ depositId, ...values }));
    if (result.payload && result.payload.success !== false) {
      formikRef.current?.resetForm();
      onSuccess && onSuccess();
    }
    onClose();
  };

  return (
    <section className={styles['c-status-update-form']}>
      <Formik
        innerRef={formikRef}
        initialValues={StatusUpdateInitialValues}
        validationSchema={StatusUpdateValidationSchema}
        validateOnChange={true}
        onSubmit={submitHandler}
        validateOnBlur={true}
        validator={() => ({})}>
        {({ values, setFieldValue, errors, handleSubmit }) => (
          <Form name='status-update' layout='vertical' onFinish={handleSubmit}>
            <CCard body='status-update' nonborder>
              <Row align={'top'} gutter={36}>
                <Col span={24}>
                  <Form.Item name='transactionStatus' label={t('transactionStatus')}>
                    <Select value={values.transactionStatus} onChange={(value) => setFieldValue('transactionStatus', value)} placeholder={t('transactionStatus')} options={transactionStatusEnum} />
                    <CErrorMessage errorMessage={errors.transactionStatus} />
                  </Form.Item>
                </Col>
              </Row>
              <Row align={'top'} gutter={36}>
                <Col span={24}>
                  <Form.Item name='refundStatus' label={t('refundStatus')}>
                    <Select value={values.refundStatus} onChange={(value) => setFieldValue('refundStatus', value)} placeholder={t('refundStatus')} options={refundStatusEnum} />
                    <CErrorMessage errorMessage={errors.refundStatus} />
                  </Form.Item>
                </Col>
              </Row>
              <Row align={'top'} gutter={36}>
                <Col span={24}>
                  <Form.Item name='comment' label={t('comment')}>
                    <Input.TextArea value={values.comment} onChange={(e) => setFieldValue('comment', e.target.value)} />
                    <CErrorMessage errorMessage={errors.comment} />
                  </Form.Item>
                </Col>
              </Row>
              <Row align={'top'} gutter={36}>
                <Col span={24} className={styles['c-status-update-form__button-area']}>
                  <Button type='danger' text={t('cancel')} handleClick={() => onClose()} />
                  <Button type='success' text={t('confirm')} handleClick={handleSubmit} />
                </Col>
              </Row>
            </CCard>
          </Form>
        )}
      </Formik>
    </section>
  );
}
