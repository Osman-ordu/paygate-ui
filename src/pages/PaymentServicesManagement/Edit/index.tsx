import { useRef, useEffect } from 'react';
import { Input, Row, Col, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { useAppDispatch } from '../../../store/hooks';
import { getPaymentServiceManagement, putPaymentServiceManagement } from '../../../store/paymentServiceManagement';
import { getPaymentServiceManagementEditTableData } from '../../../utils/general';
import { EditWorkFrequencyModalProps, getInitialValues, getValidationSchema } from '../Validation';
import CCard from '../../../components/CCard';
import ButtonArea from '../../../components/ButtonArea';
import CErrorMessage from '../../../components/CErrorMessage';
import styles from './styles.module.scss';

export default function EditWorkFrequencyModal({ onClose, onFormReset, shouldResetForm, selectedRowData }: EditWorkFrequencyModalProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formikRef: any = useRef(null);
  const validationSchema = getValidationSchema(t);
  const initialValues = getInitialValues(selectedRowData);
  const editTableData = getPaymentServiceManagementEditTableData(selectedRowData, t);

  const handleSubmit = async (values: any) => {
    if (!values.workFrequency) {
      return;
    }
    await dispatch(
      putPaymentServiceManagement({
        serviceName: values.serviceName,
        workFrequency: values.workFrequency,
        status: values.status,
        integrationType: values.integrationType,
      })
    );
    await dispatch(getPaymentServiceManagement());
    onClose();
  };

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  return (
    <CCard paddingOn>
      <Formik key={Math.random()} initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true}>
        {({ values, errors, handleSubmit, setFieldValue }) => (
          <Form name='edit-work-frequency' layout='vertical' onFinish={handleSubmit}>
            <Row align={'top'} gutter={16}>
              <Col span={12}>
                <Form.Item name='workFrequency' label={t('workFrequencySeconds')}>
                  <Input
                    value={values.workFrequency}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value === '' || /^[1-9]\d*$/.test(value)) {
                        setFieldValue('workFrequency', value);
                      }
                    }}
                    type='text'
                    min={60}
                    max={999999}
                    placeholder={t('enterWorkFrequency')}
                  />
                  <CErrorMessage errorMessage={errors.workFrequency} />
                </Form.Item>
              </Col>
            </Row>
            <table className={styles['detail-table']}>
              <tbody>
                {editTableData.map((row) => (
                  <tr key={row.key}>
                    <td className={styles['detail-table__label']}>{row.label}</td>
                    <td className={styles['detail-table__value']}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ButtonArea cancelClick={onClose} submitTitle={t('save')} submitClick={handleSubmit} />
          </Form>
        )}
      </Formik>
    </CCard>
  );
}
