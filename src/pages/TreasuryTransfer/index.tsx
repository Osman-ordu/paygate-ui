import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, Select, Input } from 'antd';
import { Formik, FormikProps } from 'formik';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getTreasuryTransfer, getTreasuryTransferSendMail } from '../../store/treasuryTransfer';
import { addQuickTransaction, getQuickTransaction } from '../../store/quickTransaction';
import { getWhiteListAccounts } from '../../store/whitelistAccounts';
import { getTransferListAccount } from '../../store/transferList';
import { extractBankCodeFromIban, getEncryptModuleData } from '../../utils/general';
import { quickTransferColumns, treasuryTransferColumns } from '../../db/Columns';
import { transferTypeEnum } from '../../db/Enums';
import { AddGeneralFormProps } from '../../dbProps';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid';
import Button from '../../components/Button';
import CustomModal from '../../components/Modal';
import CSpace from '../../components/CSpace';
import CCard from '../../components/CCard';
import { AddTransferInitialValue, AddTransferValidationSchema } from './Validation';
import MailForm from './Mail';
import DeleteForm from './Delete';
import PiBank from '../../assets/svg/PiBank.svg?react';
import PiHandWithdraw from '../../assets/svg/PiHandWitdraw.svg?react';
import BiTransfer from '../../assets/svg/BiTransfer.svg?react';
import styles from './styles.module.scss';

const TreasuryTransfer: React.FC<AddGeneralFormProps> = ({ onClose, onFormReset, shouldResetForm }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const perData = useMemo(() => getEncryptModuleData(), []);
  const pScore = useMemo(() => {
    return perData?.find((item: any) => item.moduleName === 'TreasuryTransfer')?.permissionScore;
  }, [perData]);
  const createTrue = new Set([3, 6, 7, 10]).has(pScore);
  const formikRef: any = useRef(null);
  const transferListAccount = useAppSelector((state) => state.getTransferListAccountValue?.data?.data);
  const whiteListAccounts = useAppSelector((state) => state.getWhiteListAccountsValue?.data?.data);
  const quickTransactionData = useAppSelector((state) => state.getQuickTransactionValue?.data?.data);
  const transferList = useAppSelector((state) => state.getTreasuryTransferValue?.data?.data);
  const filterWhiteListAccountsdData = useMemo(() => whiteListAccounts?.filter((item: any) => item.status === 1) || [], [whiteListAccounts]);
  const [isMailModalVisible, setIsMailModalVisible] = useState(false);
  const [isMailModalData, setIsMailModalData] = useState({});
  const [isMailModalReturn, setIsMailModalReturn] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleTransferTypeSelection = (senderId: number, recipientId: number, amount: number) => {
    if (!senderId || !recipientId || !amount) return null;
    const senderAccount = transferListAccount?.find((item: any) => item.id === senderId);
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
    if (field === 'sender' || field === 'recipient' || field === 'eachTransferAmount') {
      const newTransferType = handleTransferTypeSelection(
        field === 'sender' ? value : values.sender,
        field === 'recipient' ? value : values.recipient,
        field === 'eachTransferAmount' ? value : values.eachTransferAmount
      );
      if (newTransferType !== null) {
        setFieldValue('transferType', newTransferType);
      }

      if (field === 'sender') {
        const senderAccount = transferListAccount?.find((item: any) => item.id === value);
        setFieldValue('senderBankName', senderAccount?.companyBankName);
      }

      if (field === 'recipient') {
        const recipientAccount = filterWhiteListAccountsdData?.find((item: any) => item.id === value);
        setFieldValue('recipientBankName', recipientAccount?.bankName);
      }
    }

    setFieldValue(field, value);
  };

  const handleSubmit = async (data: any, { resetForm }: any) => {
    if (data) {
      await dispatch(
        addQuickTransaction({
          senderId: data.sender,
          recipientId: data.recipient,
          transferType: data.transferType,
          numberOfTransfers: Number(data.numberOfTransfers),
          eachTransferAmount: parseFloat(data.eachTransferAmount),
          description: data.description,
          comment: data.comment,
        })
      );
      await dispatch(getQuickTransaction());
    }
    resetForm();
    onFormReset();
    onClose();
  };

  const handleCreate = async () => {
    if (formikRef.current) {
      const formValues = formikRef.current.values;
      await dispatch(getTreasuryTransferSendMail());
      setIsMailModalVisible(true);
      setIsMailModalData({
        companyBankAccountId: formValues.sender,
        recipientId: formValues.recipient,
        transferType: formValues.transferType,
        numberOfTransfers: +formValues.numberOfTransfers,
        eachTransferAmount: +formValues.eachTransferAmount,
        description: formValues.description && formValues.description.trim() !== '' ? formValues.description : 'Treasury Transfer',
        comment: formValues.comment && formValues.comment.trim() !== '' ? formValues.comment : '',
      });
    }
  };

  const handleSelectRow = async (data: any) => {
    if (formikRef.current) {
      await formikRef.current.setValues({
        sender: data.senderId,
        recipient: data.recipientId,
        transferType: data.transferType,
        numberOfTransfers: Number(data.numberOfTransfers),
        eachTransferAmount: parseFloat(data.eachTransferAmount),
        description: data.description,
        comment: data.comment,
      });

      await formikRef.current.validateForm();
      handleFieldChange('sender', data.senderId, formikRef.current.setFieldValue, formikRef.current.values);
      handleFieldChange('recipient', data.recipientId, formikRef.current.setFieldValue, formikRef.current.values);
    }
  };

  const handleOpenDeleteModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
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
      await dispatch(getQuickTransaction());
      await dispatch(getTreasuryTransfer());
    };
    fetchFormApis();
  }, [dispatch]);

  useEffect(() => {
    if (isMailModalReturn) {
      const refreshData = async () => {
        await dispatch(getTreasuryTransfer());
      };
      refreshData();
      onFormReset && onFormReset();
      onClose && onClose();
      setIsMailModalReturn(false);
    }
  }, [isMailModalReturn]);

  return (
    <section className={styles['c-treasury-transfer']}>
      <CustomModal title={t('deleteQuickTransfer')} isVisible={isDeleteModalVisible} onClose={handleCloseDeleteModal} width='25%'>
        <DeleteForm selectedRowData={selectedRowData} onClose={handleCloseDeleteModal} />
      </CustomModal>
      {createTrue && (
        <>
          <CustomModal title={t('mailAuthenticator')} isVisible={isMailModalVisible} onClose={() => setIsMailModalVisible(false)}>
            <MailForm text={t('mailText')} onCloseMail={() => setIsMailModalVisible(false)} onClose={() => setIsMailModalReturn(true)} selectedRowData={isMailModalData} />
          </CustomModal>
          <div className={styles['c-treasury-transfer__add-transfer']}>
            <PageTitle type='data' svg={<BiTransfer />} title={t('addTransfer')} />
            <Formik innerRef={formikRef} initialValues={AddTransferInitialValue()} validationSchema={AddTransferValidationSchema} validateOnChange={true} onSubmit={handleSubmit} validateOnBlur={true}>
              {({ values, setFieldValue, handleSubmit, errors }: FormikProps<any>) => {
                const isFormValid = values.sender && values.recipient && values.eachTransferAmount && values.numberOfTransfers && values.transferType && Object.keys(errors).length === 0;
                return (
                  <Form name='addTransfer' layout='vertical' onFinish={handleSubmit} className={styles['c-treasury-transfer__add-transfer__form']}>
                    <CCard body='treasury' nonborder>
                      <Row align={'middle'} gutter={18}>
                        <Col span={6}>
                          <Form.Item
                            name='sender'
                            validateStatus={errors?.sender ? 'error' : ''}
                            hasFeedback={!!errors?.sender}
                            label={
                              <span>
                                {t('sender')}
                                {values.senderBankName && (
                                  <span className={`${styles['c-treasury-transfer__readonly-text']} ${styles['c-treasury-transfer__sender-text']}`}> → {values.senderBankName}</span>
                                )}
                              </span>
                            }>
                            <Select
                              showSearch
                              optionFilterProp='label'
                              value={values?.sender}
                              onChange={(value) => handleFieldChange('sender', value, setFieldValue, values)}
                              placeholder={t('sender')}>
                              {transferListAccount?.map((item: any) => {
                                return (
                                  <Select.Option key={item?.id} value={item?.id} label={item?.accountName}>
                                    {item?.accountName}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            name='recipient'
                            validateStatus={errors?.recipient ? 'error' : ''}
                            hasFeedback={!!errors?.recipient}
                            label={
                              <span>
                                {t('recipient')}
                                {values.recipientBankName && (
                                  <span className={`${styles['c-treasury-transfer__readonly-text']} ${styles['c-treasury-transfer__recipient-text']}`}> → {values.recipientBankName}</span>
                                )}
                              </span>
                            }>
                            <Select
                              showSearch
                              optionFilterProp='label'
                              value={values?.recipient}
                              onChange={(value) => handleFieldChange('recipient', value, setFieldValue, values)}
                              placeholder={t('recipient')}>
                              {filterWhiteListAccountsdData?.map((item: any) => {
                                return (
                                  <Select.Option key={item?.id} value={item?.id} label={item?.readableName}>
                                    {item?.readableName}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item name='eachTransferAmount' label={t('eachTransferAmount')} validateStatus={errors?.eachTransferAmount ? 'error' : ''} hasFeedback={!!errors?.eachTransferAmount}>
                            <Input
                              defaultValue={values?.eachTransferAmount}
                              value={values?.eachTransferAmount}
                              type='number'
                              placeholder={t('eachTransferAmount')}
                              min={1}
                              onChange={(event) => handleFieldChange('eachTransferAmount', event.target.value, setFieldValue, values)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item name='transferType' label={t('transferType')} validateStatus={errors?.transferType ? 'error' : ''} hasFeedback={!!errors?.transferType}>
                            <Select value={values?.transferType} onChange={(value) => setFieldValue('transferType', value)} placeholder={t('transferType')} options={transferTypeEnum} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row align={'middle'} gutter={18}>
                        <Col span={6}>
                          <Form.Item name='numberOfTransfers' label={t('numberOfTransfers')} validateStatus={errors?.numberOfTransfers ? 'error' : ''} hasFeedback={!!errors?.numberOfTransfers}>
                            <Input
                              defaultValue={values?.numberOfTransfers}
                              value={values?.numberOfTransfers}
                              type='number'
                              placeholder={t('numberOfTransfers')}
                              min={1}
                              step='1'
                              onChange={(e) => handleFieldChange('numberOfTransfers', e.target.value, setFieldValue, values)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item name='description' label={t('description')} validateStatus={errors?.description ? 'error' : ''} hasFeedback={!!errors?.description}>
                            <Input
                              defaultValue={values.description}
                              value={values.description}
                              type='text'
                              placeholder={t('description')}
                              onChange={(e) => setFieldValue('description', e.target.value)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item name='comment' label={t('comment')} validateStatus={errors?.comment ? 'error' : ''} hasFeedback={!!errors?.comment}>
                            <Input defaultValue={values?.comment} value={values?.comment} type='text' placeholder={t('comment')} onChange={(e) => setFieldValue('comment', e.target.value)} />
                          </Form.Item>
                        </Col>

                        <Col span={6} className={styles['c-treasury-transfer__button-area']}>
                          <Button type='success' text={t('save')} handleClick={handleSubmit} />
                          <Button type={isFormValid ? 'primary' : 'disabled'} text={t('create')} handleClick={handleCreate} disabled={!isFormValid} />
                        </Col>
                      </Row>
                    </CCard>
                  </Form>
                );
              }}
            </Formik>
          </div>
          <div className={styles['c-treasury-transfer__quick-transfer']}>
            <PageTitle type='data' svg={<PiHandWithdraw />} title={t('quickTransfer')} />
            <CDataGrid
              gridKey={'quickTransfer'}
              pTitle='TreasuryTransfer'
              addLogicVisible={false}
              data={quickTransactionData}
              columns={quickTransferColumns}
              columnFilter={true}
              stateStore='NO'
              editButtonVisible={false}
              deleteButtonVisible={false}
              refreshVisible={false}
              handleSelectRow={handleSelectRow}
              selectButtonVisible={true}
              deleteVisible={true}
              handleDeleteRow={handleOpenDeleteModal}
              height={'38vh'}
            />
          </div>
        </>
      )}
      <div className={styles['c-treasury-transfer__treasury-transfer']}>
        <PageTitle type='data' svg={<PiBank />} title={t('treasuryTransfer')} />
        {!createTrue && <CSpace type='tt'></CSpace>}
        <CDataGrid
          gridKey={'accountStorage'}
          pTitle='TreasuryTransfer'
          addLogicVisible={false}
          data={transferList}
          columns={treasuryTransferColumns}
          columnFilter={true}
          stateStore='NO'
          editButtonVisible={false}
          deleteButtonVisible={false}
          selectButtonVisible={false}
          refreshVisible={false}
          height={'38vh'}
        />
      </div>
    </section>
  );
};
export default TreasuryTransfer;
