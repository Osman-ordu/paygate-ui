import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, Row, Select, DatePicker } from 'antd';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getWhiteListAccounts } from '../../../store/whitelistAccounts';
import { addManualTransfer, getTransferList, getTransferListAccount } from '../../../store/transferList';
import { transferTypeEnum } from '../../../db/Enums';
import { AddGeneralFormProps, AddTransferListProps } from '../../../dbProps';
import CCard from '../../../components/CCard';
import ButtonArea from '../../../components/ButtonArea';
import CErrorMessage from '../../../components/CErrorMessage';
import { AddTransferListInitialValue, AddTransferListValidationSchema } from '../Validation';
import styles from '../styles.module.scss';

const AddTransferList: React.FC<AddGeneralFormProps> = ({ onClose, onFormReset, shouldResetForm }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formikRef: any = useRef(null);
  const whiteListAccounts = useAppSelector((state) => state.getWhiteListAccountsValue?.data?.data);
  const transferListAccount = useAppSelector((state) => state.getTransferListAccountValue?.data?.data);

  const handleTreasuryAccountChange = (value: number) => {
    const selectedAccount = transferListAccount?.find((account: any) => account.id === value);
    if (selectedAccount) {
      formikRef.current.setFieldValue('senderIban', selectedAccount.iban);
      formikRef.current.setFieldValue('senderBankName', selectedAccount.companyBankName);
    }
  };

  const handleWhitelistAccountChange = (value: number) => {
    const selectedAccount = whiteListAccounts?.find((account: any) => account.id === value);
    if (selectedAccount) {
      formikRef.current.setFieldValue('recipientBankName', selectedAccount.bankName);
      formikRef.current.setFieldValue('recipientFullName', selectedAccount.fullName);
      formikRef.current.setFieldValue('recipientIban', selectedAccount.iban);
    }
  };

  const submitHandler = async (data: AddTransferListProps, { resetForm }: any) => {
    if (data) {
      await dispatch(
        addManualTransfer({
          companyBankAccountId: data.senderAccountName,
          recipientId: data.whitelistAccountName,
          transferType: data.transferType,
          amount: Number(data.amount),
          comment: data.comment,
          transactionNo: data.transactionNo,
          transferDate: data.dateAndTime,
        })
      );
      await dispatch(getTransferList({}));
    }
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

  useEffect(() => {
    const fetchFormApis = async () => {
      await dispatch(getWhiteListAccounts());
      await dispatch(getTransferListAccount());
    };
    fetchFormApis();
  }, [dispatch]);

  return (
    <section className={styles['c-transferListAdd']}>
      <Formik
        key={Math.random()}
        innerRef={formikRef}
        initialValues={AddTransferListInitialValue()}
        validationSchema={AddTransferListValidationSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={submitHandler}>
        {({ values, setFieldValue, errors, handleSubmit, touched }) => {
          return (
            <Form name='add-transfer-list' layout='vertical' onFinish={handleSubmit}>
              <CCard paddingOn>
                <Row align={'top'} gutter={36}>
                  <Col span={12}>
                    <Form.Item
                      name='senderAccountName'
                      label={t('sender_account_name')}
                      validateStatus={touched.senderAccountName && errors.senderAccountName ? 'error' : ''}
                      help={touched.senderAccountName && errors.senderAccountName ? t('sender_account_name') : ''}>
                      <Select
                        showSearch
                        optionFilterProp='label'
                        value={values?.senderAccountName}
                        onChange={(value: any) => {
                          setFieldValue('senderAccountName', value);
                          handleTreasuryAccountChange(value);
                        }}
                        placeholder={t('sender_account_name')}>
                        {transferListAccount?.map((item: any) => {
                          return (
                            <Select.Option key={item.id} value={item.id} label={item.accountName}>
                              {item.accountName}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='whitelistAccountName'
                      label={t('whitelist_account_name')}
                      validateStatus={touched.whitelistAccountName && errors.whitelistAccountName ? 'error' : ''}
                      help={touched.whitelistAccountName && errors.whitelistAccountName ? t('whitelist_account_name') : ''}>
                      <Select
                        showSearch
                        optionFilterProp='label'
                        value={values?.whitelistAccountName}
                        onChange={(value: any) => {
                          setFieldValue('whitelistAccountName', value);
                          handleWhitelistAccountChange(value);
                        }}
                        placeholder={t('whitelist_account_name')}>
                        {whiteListAccounts
                          ?.filter((item: any) => item.status === 1)
                          .map((item: any) => {
                            return (
                              <Select.Option key={item.id} value={item.id} label={item.readableName}>
                                {item.readableName}
                              </Select.Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className={styles['c-transferListAdd__readOnly']} span={12}>
                    <Form.Item name='senderBankName' label={t('sender_bank_name')}>
                      <Input defaultValue={values.senderBankName} value={values.senderBankName} type='text' placeholder={t('sender_bank_name')} readOnly />
                      <CErrorMessage errorMessage={errors.senderBankName} />
                    </Form.Item>
                  </Col>
                  <Col className={styles['c-transferListAdd__readOnly']} span={12}>
                    <Form.Item name='recipientBankName' label={t('recipient_bank_name')}>
                      <Input
                        value={values.recipientBankName}
                        onChange={(event) => setFieldValue('recipientBankName', event.target.value)}
                        type='text'
                        placeholder={t('recipient_bank_name')}
                        readOnly
                      />
                      <CErrorMessage errorMessage={errors.recipientBankName} />
                    </Form.Item>
                  </Col>
                  <Col className={styles['c-transferListAdd__readOnly']} span={12}>
                    <Form.Item name='senderIban' label={t('sender_iban')}>
                      <Input value={values.senderIban} type='text' maxLength={32} placeholder='TR ---' readOnly />
                      <CErrorMessage errorMessage={errors.senderIban} />
                    </Form.Item>
                  </Col>
                  <Col className={styles['c-transferListAdd__readOnly']} span={12}>
                    <Form.Item name='recipientFullName' label={t('recipient_full_name')}>
                      <Input
                        value={values.recipientFullName}
                        onChange={(event) => setFieldValue('recipientFullName', event.target.value)}
                        type='text'
                        placeholder={t('recipient_full_name')}
                        readOnly
                      />
                      <CErrorMessage errorMessage={errors.recipientFullName} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='transactionNo' label={t('transaction_no')}>
                      <Input value={values.transactionNo} onChange={(event) => setFieldValue('transactionNo', event.target.value)} type='text' placeholder={t('transaction_no')} />
                      <CErrorMessage errorMessage={errors.transactionNo} />
                    </Form.Item>
                  </Col>
                  <Col className={styles['c-transferListAdd__readOnly']} span={12}>
                    <Form.Item name='recipientIban' label={t('recipient_iban')}>
                      <Input value={values.recipientIban} onChange={(event) => setFieldValue('recipientIban', event.target.value)} type='text' placeholder='TR ---' readOnly />
                      <CErrorMessage errorMessage={errors.recipientIban} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='comment' label={t('comment')}>
                      <Input value={values.comment} onChange={(event) => setFieldValue('comment', event.target.value)} type='text' placeholder={t('comment')} />
                      <CErrorMessage errorMessage={errors.comment} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='amount' label={t('amount')}>
                      <Input value={values.amount} onChange={(event) => setFieldValue('amount', event.target.value)} type='number' placeholder={t('amount')} />
                      <CErrorMessage errorMessage={errors.amount} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='transferType'
                      label={t('transferType')}
                      validateStatus={touched.transferType && errors.transferType ? 'error' : ''}
                      help={touched.transferType && errors.transferType ? t('transfer_type') : ''}>
                      <Select value={values.transferType} onChange={(value) => setFieldValue('transferType', value)} placeholder={t('transferType')} options={transferTypeEnum} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='dateAndTime' label={t('date_and_time')}>
                      <DatePicker
                        style={{ width: '100%' }}
                        defaultValue={dayjs(values?.dateAndTime)}
                        showTime={{ format: 'HH:mm' }}
                        format='DD/MM/YYYY HH:mm'
                        value={dayjs(values?.dateAndTime)}
                        onChange={(date) => setFieldValue('dateAndTime', date?.toISOString())}
                      />
                    </Form.Item>
                    <CErrorMessage errorMessage={errors.dateAndTime} />
                  </Col>
                </Row>
              </CCard>
              <Row>
                <Col span={24}>
                  <ButtonArea cancelClick={() => onClose()} submitTitle='create' />
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </section>
  );
};
export default AddTransferList;
