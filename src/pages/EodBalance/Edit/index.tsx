import { useEffect, useRef } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../../store/hooks';
import { getEodBalanceList, putEodBalance } from '../../../store/eodBalance';
import { preventNonNumericKeys } from '../../../utils/general';
import { editInitialValues, EditEodBalanceValidationSchema } from '../Validation';
import CCard from '../../../components/CCard';
import CErrorMessage from '../../../components/CErrorMessage';
import ButtonArea from '../../../components/ButtonArea';

export default function EditEodBalance({ onClose, onFormReset, shouldResetForm, selectedRowData }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formikRef: any = useRef(null);

  const handleSubmit = async (values: any) => {
    if (selectedRowData) {
      const submitValues = {
        id: selectedRowData.id,
        client: values.client,
        custody: values.custody,
        lp: values.lp,
        bank: values.bank,
      };
      await dispatch(putEodBalance(submitValues));
    }
    const currentDate = dayjs().startOf('day').add(3, 'hour');
    const currentDateString = currentDate.toISOString();
    await dispatch(getEodBalanceList({ date: currentDateString }));
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
      <Formik key={Math.random()} initialValues={editInitialValues(selectedRowData)} validationSchema={EditEodBalanceValidationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue, errors, handleSubmit }) => (
          <Form name='edit-eod-balance' layout='vertical' onFinish={handleSubmit}>
            <Row align={'top'} gutter={16}>
              <Col span={12}>
                <Form.Item name='client' label={t('client')}>
                  <Input value={values.client} onChange={(event) => setFieldValue('client', event.target.value)} onKeyDown={preventNonNumericKeys} type='number' placeholder={t('client')} />
                  <CErrorMessage errorMessage={errors.client} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='custody' label={t('custody')}>
                  <Input value={values.custody} onChange={(event) => setFieldValue('custody', event.target.value)} onKeyDown={preventNonNumericKeys} type='number' placeholder={t('custody')} />
                  <CErrorMessage errorMessage={errors.custody} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='lp' label={t('lp')}>
                  <Input value={values.lp} onChange={(event) => setFieldValue('lp', event.target.value)} onKeyDown={preventNonNumericKeys} type='number' placeholder={t('lp')} />
                  <CErrorMessage errorMessage={errors.lp} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='bank' label={t('bank')}>
                  <Input value={values.bank} onChange={(event) => setFieldValue('bank', event.target.value)} onKeyDown={preventNonNumericKeys} type='number' placeholder={t('bank')} />
                  <CErrorMessage errorMessage={errors.bank} />
                </Form.Item>
              </Col>
            </Row>
            <ButtonArea cancelClick={onClose} submitTitle={t('save')} submitClick={handleSubmit} />
          </Form>
        )}
      </Formik>
    </CCard>
  );
}
