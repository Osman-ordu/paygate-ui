import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { Col, Form, Input, Row } from 'antd';
import { useAppDispatch } from '../../../store/hooks';
import { addWhiteListAccounts, getWhiteListAccounts } from '../../../store/whitelistAccounts';
import { bankFind } from '../../../utils/general';
import CCard from '../../../components/CCard';
import CErrorMessage from '../../../components/CErrorMessage';
import ButtonArea from '../../../components/ButtonArea';
import { addInitialValue, validationSchema } from '../Validation';

export default function AddForm({ onClose, onFormReset, shouldResetForm }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formikRef: any = useRef(null);

  const submitHandler = async (data: any, { resetForm }: any) => {
    await dispatch(
      addWhiteListAccounts({
        readableName: data.readableName,
        iban: 'TR' + data.iban,
        tcknVkn: data.tcknVkn,
        fullName: data.fullName,
        comment: data.comment,
        bankName: data.bankName,
      })
    );
    await dispatch(getWhiteListAccounts());

    resetForm();
    onFormReset();
    onClose();
  };

  const ibanToBank = (value: string) => {
    formikRef.current.setFieldValue('iban', value);
    if (value.startsWith('TR')) value = value.slice(2);

    value = value.replace(/\s+/g, '');

    if (value.length === 24) {
      const bankName = bankFind(value);
      clearTimeout((ibanToBank as any).timeout);
      (ibanToBank as any).timeout = setTimeout(() => {
        formikRef.current.setFieldValue('bankName', bankName);
        formikRef.current.setFieldValue('iban', value);
      }, 100);
    }
  };

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  return (
    <Formik innerRef={formikRef} initialValues={addInitialValue()} validationSchema={validationSchema} validateOnChange={true} onSubmit={submitHandler} validateOnBlur={true}>
      {({ values, setFieldValue, errors, handleSubmit }) => (
        <Form name='add-profile' layout='vertical' onFinish={handleSubmit}>
          <CCard paddingOn>
            <Row align={'top'} gutter={36}>
              <Col span={12}>
                <Form.Item name='readableName' label={t('name')}>
                  <>
                    <Input value={values.readableName} onChange={(event) => setFieldValue('readableName', event.target.value)} type='text' placeholder={t('name')} />
                    <CErrorMessage errorMessage={errors.readableName} />
                  </>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='tcknVkn' label={t('recipientTC')}>
                  <>
                    <Input value={values.tcknVkn} onChange={(event) => setFieldValue('tcknVkn', event.target.value)} type='text' placeholder={t('recipientTC')} />
                    <CErrorMessage errorMessage={errors.tcknVkn} />
                  </>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='bankName' label={t('recipientBank')}>
                  <>
                    <Input value={values.bankName} onChange={(event) => setFieldValue('bankName', event.target.value)} type='text' placeholder={t('recipientBank')} disabled />
                    <CErrorMessage errorMessage={errors.bankName} />
                  </>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='iban' label={t('recipientIBAN')}>
                  <>
                    <Input addonBefore='TR' value={values.iban} onChange={(event) => ibanToBank(event.target.value)} type='text' maxLength={32} placeholder={t('recipientIBAN')} />
                    <CErrorMessage errorMessage={errors.iban} />
                  </>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='fullName' label={t('recipientFullName')}>
                  <>
                    <Input value={values.fullName} onChange={(event) => setFieldValue('fullName', event.target.value)} type='text' placeholder={t('recipientFullName')} />
                    <CErrorMessage errorMessage={errors.fullName} />
                  </>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='comment' label={t('comment')}>
                  <>
                    <Input value={values.comment} onChange={(event) => setFieldValue('comment', event.target.value)} type='text' placeholder={t('comment')} />
                    <CErrorMessage errorMessage={errors.comment} />
                  </>
                </Form.Item>
              </Col>
            </Row>
          </CCard>
          <Row>
            <Col span={24}>
              <ButtonArea cancelClick={() => onClose()} />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}
