import { useEffect, useMemo, useRef, useState } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getTreasuryTransferSendMail } from '../../../store/treasuryTransfer';
import { getWhiteListAccounts } from '../../../store/whitelistAccounts';
import { getTransferListAccount } from '../../../store/transferList';
import { extractBankCodeFromIban } from '../../../utils/general';
import { transferTypeEnum } from '../../../db/Enums';
import ButtonArea from '../../../components/ButtonArea';
import CErrorMessage from '../../../components/CErrorMessage';
import CCard from '../../../components/CCard';
import CustomModal from '../../../components/Modal';
import { AddAValidationSchema, AddInitialValue } from '../Validation';
import MailForm from '../Mail';

export default function AddForm({ onClose, onFormReset, shouldResetForm }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const senderData = useAppSelector((state) => state?.getTransferListAccountValue?.data?.data);
  const whiteListAccountsdData = useAppSelector((state) => state?.getWhiteListAccountsValue?.data?.data);
  const filterWhiteListAccountsdData = useMemo(() => whiteListAccountsdData?.filter((item: any) => item.status === 1) || [], [whiteListAccountsdData]);
  const formikRef = useRef<FormikProps<any>>(null);
  const [isMailModalVisible, setIsMailModalVisible] = useState(false);
  const [isMailModalData, setIsMailModalData] = useState({});
  const [isMailModalReturn, setIsMailModalReturn] = useState(false);

  const handleTransferTypeSelection = (senderId: number, recipientId: number, amount: number) => {
    if (!senderId || !recipientId) return null;
    const senderAccount = senderData?.find((item: any) => item.id === senderId);
    const recipientAccount = filterWhiteListAccountsdData?.find((item: any) => item.id === recipientId);
    if (!senderAccount || !recipientAccount) return null;

    const senderBankCode = extractBankCodeFromIban(senderAccount.iban);
    const recipientBankCode = extractBankCodeFromIban(recipientAccount.iban);
    const isSameBank = senderBankCode === recipientBankCode;

    switch (true) {
      case isSameBank:
        return 2;
      case !isSameBank && amount < 100000:
        return 3;
      case !isSameBank && amount >= 100000:
        return 1;
      default:
        return null;
    }
  };

  const handleFieldChange = (field: string, value: any, setFieldValue: (field: string, value: any) => void, values: any) => {
    setFieldValue(field, value);

    if (field === 'sender' || field === 'recipent' || field === 'eachTransferAmount') {
      const newTransferType = handleTransferTypeSelection(
        field === 'sender' ? value : values.sender,
        field === 'recipent' ? value : values.recipent,
        field === 'eachTransferAmount' ? value : values.eachTransferAmount
      );
      if (newTransferType !== null) {
        setFieldValue('transferType', newTransferType);
      }
    }
  };

  const submitHandler = (data: any) => {
    dispatch(getTreasuryTransferSendMail());
    setIsMailModalVisible(true);
    setIsMailModalData({
      companyBankAccountId: data.sender,
      recipientId: data.recipent,
      transferType: data.transferType,
      numberOfTransfers: +data.numberOfTransfers,
      eachTransferAmount: +data.eachTransferAmount,
      description: data.description && data.description.trim() !== '' ? data.description : 'Treasury Transfer',
      comment: data.comment && data.comment.trim() !== '' ? data.comment : '',
    });
  };

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  useEffect(() => {
    const fetchFormApis = async () => {
      await dispatch(getTransferListAccount());
      await dispatch(getWhiteListAccounts());
    };
    fetchFormApis();
  }, [dispatch]);

  useEffect(() => {
    if (isMailModalReturn) {
      onFormReset();
      onClose();
      setIsMailModalReturn(false);
    }
  }, [isMailModalReturn]);

  return (
    <>
      <CustomModal title={t('mailAuthenticator')} isVisible={isMailModalVisible} onClose={() => setIsMailModalVisible(false)}>
        <MailForm text={t('mailText')} onCloseMail={() => setIsMailModalVisible(false)} onClose={() => setIsMailModalReturn(true)} selectedRowData={isMailModalData} />
      </CustomModal>
      <Formik
        innerRef={formikRef}
        initialValues={AddInitialValue()}
        validationSchema={AddAValidationSchema}
        validateOnChange={true}
        onSubmit={submitHandler}
        validateOnBlur={true}
        validator={() => ({})}>
        {({ values, setFieldValue, errors, handleSubmit }) => (
          <Form name='add-form' layout='vertical' onFinish={handleSubmit}>
            <CCard paddingOn>
              <Row align={'top'} gutter={36}>
                <Col span={12}>
                  <Form.Item name='sender' label={t('sender')}>
                    <Select
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input: any, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                      filterSort={(optionA: any, optionB: any) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                      value={values.sender}
                      defaultValue={values.sender}
                      onChange={(value) => handleFieldChange('sender', value, setFieldValue, values)}
                      placeholder={t('sender')}>
                      {senderData?.map((item: any) => {
                        return (
                          <Select.Option label={item?.accountName} value={item?.id} key={item?.id}>
                            {item?.accountName}
                          </Select.Option>
                        );
                      })}
                    </Select>
                    <CErrorMessage errorMessage={errors.sender} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='eachTransferAmount' label={t('eachTransferAmount')}>
                    <Input
                      value={values.eachTransferAmount}
                      onChange={(event) => handleFieldChange('eachTransferAmount', event.target.value, setFieldValue, values)}
                      type='number'
                      placeholder={t('eachTransferAmount')}
                      min={1}
                      step='0.01'
                    />
                    <CErrorMessage errorMessage={errors.eachTransferAmount} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='recipent' label={t('recipent')}>
                    <Select
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input: any, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                      filterSort={(optionA: any, optionB: any) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                      value={values.recipent}
                      defaultValue={values.recipent}
                      onChange={(value) => handleFieldChange('recipent', value, setFieldValue, values)}
                      placeholder={t('recipent')}>
                      {filterWhiteListAccountsdData?.map((item: any) => {
                        return (
                          <Select.Option label={item?.readableName} value={item?.id} key={item?.id}>
                            {item?.readableName}
                          </Select.Option>
                        );
                      })}
                    </Select>
                    <CErrorMessage errorMessage={errors.recipent} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='description' label={t('description')}>
                    <Input value={values.description} onChange={(event) => setFieldValue('description', event.target.value)} type='text' placeholder={t('description')} />
                    <CErrorMessage errorMessage={errors.description} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='transferType' label={t('transferType')}>
                    <Select
                      showSearch
                      optionFilterProp='children'
                      value={values?.transferType}
                      onChange={(value) => setFieldValue('transferType', value)}
                      placeholder={t('transferType')}
                      options={transferTypeEnum}
                    />
                    <CErrorMessage errorMessage={errors.transferType} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='comment' label={t('comment')}>
                    <Input value={values.comment} onChange={(event) => setFieldValue('comment', event.target.value)} type='text' placeholder={t('comment')} />
                    <CErrorMessage errorMessage={errors.comment} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='numberOfTransfers' label={t('numberOfTransfers')}>
                    <Input value={values.numberOfTransfers} onChange={(event) => setFieldValue('numberOfTransfers', event.target.value)} type='number' placeholder={t('numberOfTransfers')} min={1} />
                    <CErrorMessage errorMessage={errors.numberOfTransfers} />
                  </Form.Item>
                </Col>
              </Row>
            </CCard>
            <Row>
              <Col span={24}>
                <ButtonArea cancelClick={() => onClose()} submitTitle='create' />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
}
