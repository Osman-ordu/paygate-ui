import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { Col, Form, Input, Row, Select } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { editAutoTransferBalance, getAutoTransferBalance } from '../../../store/autoTransferBalance';
import { getBankAccountList } from '../../../store/bankAccountDetail';
import CCard from '../../../components/CCard';
import CErrorMessage from '../../../components/CErrorMessage';
import ButtonArea from '../../../components/ButtonArea';
import { editInitialValues, validationSchema } from '../Validation';

export default function EditForm({ onClose, onFormReset, shouldResetForm, selectedRowData }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formikRef: any = useRef(null);
  const bankAccountDetailData = useAppSelector((state) => state.getBankAccountListValue?.data?.data);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const getAccountId = (value: string | number) => {
    if (bankAccountDetailData?.some((item: any) => item.id === value)) {
      return value;
    }
    const found = bankAccountDetailData?.find((item: any) => item.accountName === value);
    return found ? found.id : null;
  };

  const handleAccountChange = (
    value: any,
    name: string,
    setFieldValue: (field: any, value: any) => void,
    bankAccountDetailData: any[],
    setErrorMessage: (msg: string | undefined) => void,
    values: any
  ) => {
    const otherName = name === 'withdrawalAccount' ? 'depositAccount' : 'withdrawalAccount';
    const selectedAccount = bankAccountDetailData?.find((item) => item.id === value);
    const otherAccount = bankAccountDetailData?.find((item) => item.id === values[otherName]);
    if (selectedAccount && otherAccount) {
      if (selectedAccount.companyBankName !== otherAccount.companyBankName) {
        setErrorMessage(t('sameBankError'));
      } else {
        setErrorMessage(undefined);
      }
    } else {
      setErrorMessage(undefined);
    }
    setFieldValue(name, value);
  };

  const submitHandler = async (data: any, { resetForm }: any) => {
    const withdrawAccountId = getAccountId(data.withdrawalAccount);
    const depositAccountId = getAccountId(data.depositAccount);

    await dispatch(
      editAutoTransferBalance({
        id: selectedRowData.id,
        withdrawAccount: withdrawAccountId,
        depositAccount: depositAccountId,
        topUpBalance: parseFloat(data.topUpBalance),
        maintenanceBalance: parseFloat(data.maintenanceBalance),
        prioritization: Number(data.prioritization),
      })
    );
    await dispatch(getAutoTransferBalance());

    resetForm();
    onFormReset();
    formikRef.current.resetForm();
    onClose();
  };

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  useEffect(() => {
    const fetchApi = async () => {
      await dispatch(getBankAccountList());
    };
    fetchApi();
  }, [dispatch, selectedRowData]);

  return (
    <Formik
      key={Math.random()}
      innerRef={formikRef}
      initialValues={editInitialValues(selectedRowData)}
      enableReinitialize={true}
      validationSchema={validationSchema}
      validateOnChange={true}
      onSubmit={submitHandler}
      validateOnBlur={true}>
      {({ values, setFieldValue, errors, handleSubmit }) => {
        return (
          <Form name='edit-auto-transfer-balance' layout='vertical' onFinish={handleSubmit}>
            <CCard paddingOn>
              <Row align={'top'} gutter={36}>
                <Col span={12}>
                  <Form.Item name='withdrawalAccount' label={t('withdrawalAccount')} help={errorMessage} validateStatus={errorMessage ? 'error' : ''}>
                    <Select
                      value={values.withdrawalAccount}
                      defaultValue={values.withdrawalAccount}
                      onChange={(value) => handleAccountChange(value, 'withdrawalAccount', setFieldValue, bankAccountDetailData, setErrorMessage, values)}
                      placeholder={t('withdrawalAccount')}>
                      {bankAccountDetailData
                        ?.filter((item: any) => item.accountType === 1)
                        ?.map((item: any) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.accountName}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='maintenanceBalance' label={t('maintenanceBalance')}>
                    <>
                      <Input value={values.maintenanceBalance} onChange={(event) => setFieldValue('maintenanceBalance', event.target.value)} type='number' placeholder={t('maintenanceBalance')} />
                      <CErrorMessage errorMessage={errors.maintenanceBalance} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='depositAccount' label={t('depositAccount')} help={errorMessage} validateStatus={errorMessage ? 'error' : ''}>
                    <Select
                      value={values.depositAccount}
                      defaultValue={values.depositAccount}
                      onChange={(value) => handleAccountChange(value, 'depositAccount', setFieldValue, bankAccountDetailData, setErrorMessage, values)}
                      placeholder={t('depositAccount')}>
                      {bankAccountDetailData
                        ?.filter((item: any) => item.accountType === 2)
                        ?.map((item: any) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.accountName}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='topUpBalance' label={t('topUpBalance')}>
                    <>
                      <Input value={values.topUpBalance} onChange={(event) => setFieldValue('topUpBalance', event.target.value)} type='number' placeholder={t('topUpBalance')} />
                      <CErrorMessage errorMessage={errors.topUpBalance} className={'position-absolute'} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='prioritization' label={t('prioritization')}>
                    <>
                      <Input value={values.prioritization} onChange={(event) => setFieldValue('prioritization', event.target.value)} type='number' placeholder={t('prioritization')} />
                      <CErrorMessage errorMessage={errors.prioritization} />
                    </>
                  </Form.Item>
                </Col>
              </Row>
            </CCard>
            <Row>
              <Col span={24}>
                <ButtonArea submitTitle={t('save')} cancelClick={() => onClose()} />
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
}
