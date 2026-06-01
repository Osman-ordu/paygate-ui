import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, Select, Input } from 'antd';
import { Formik, FormikProps } from 'formik';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addLPQuickTransaction, getLPQuickTransaction } from '../../store/LPQuickTransaction';
import { getLpBalance } from '../../store/LPBalance';
import { getLpWhitelistActiveList } from '../../store/lpWhitelist';
import { addLpTransaction, getLpWhitelistId, postLPTransactionCurrencies, postLPTransactionNetworks } from '../../store/LPTransaction';
import { getEncryptModuleData } from '../../utils/general';
import { lpBalancesColumns, lpQuickTransferColumns } from '../../db/Columns';
import { entityTypeEnum, senderLpEnum } from '../../db/Enums';
import { AddGeneralFormProps } from '../../dbProps';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid/Lazy';
import Button from '../../components/Button';
import CSpace from '../../components/CSpace';
import CCard from '../../components/CCard';
import CustomModal from '../../components/Modal';
import { AddTransferInitialValue, AddTransferValidationSchema } from './Validation';
import DeleteForm from './Delete';
import PiBank from '../../assets/svg/PiBank.svg?react';
import PiHandWithdraw from '../../assets/svg/PiHandWitdraw.svg?react';
import ILpTransfer from '../../assets/svg/LpTransfer.svg?react';
import styles from './styles.module.scss';

const LpTransfer: React.FC<AddGeneralFormProps> = ({ onClose, onFormReset, shouldResetForm }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const perData = useMemo(() => getEncryptModuleData(), []);
  const pScore = useMemo(() => {
    return perData?.find((item: any) => item.moduleName === 'LPTransfer')?.permissionScore;
  }, [perData]);
  const createTrue = new Set([3, 6, 7, 10]).has(pScore);
  const formikRef: any = useRef(null);
  const whiteListAccounts = useAppSelector((state) => state.getLpWhitelistActiveListValue?.data?.data);
  const quickLpTransactionData = useAppSelector((state) => state.getLPQuickTransactionValue?.data?.data);
  const lpBalanceData = useAppSelector((state) => state.getLpBalanceValue?.data?.data);
  const currenciesList = useAppSelector((state: any) => state.postLPTransactionCurrenciesValue?.data?.data);
  const filterWhiteListAccountsdData = useMemo(() => whiteListAccounts?.filter((item: any) => item.status === 2) || [], [whiteListAccounts]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleFieldChange = async (field: string, value: any, setFieldValue: (field: string, value: any) => void) => {
    setFieldValue(field, value);

    if (field === 'senderLP') {
      const selectedSender = senderLpEnum.find((item: any) => item.value === value);
      setFieldValue('senderId', selectedSender?.value);
      setFieldValue('senderLPCurrency', undefined);
      setFieldValue('recipient', undefined);
      setFieldValue('recipientId', undefined);
      setFieldValue('walletAddress', undefined);
      setFieldValue('memoTag', undefined);
      setFieldValue('network', undefined);
      setFieldValue('recipientCurrency', undefined);
      setFieldValue('vaspName', undefined);
      setFieldValue('corporateName', undefined);
      setFieldValue('channel', undefined);
      setFieldValue('entityType', undefined);
    }

    if (field === 'recipient') {
      const recipientAccountResponse = await dispatch(getLpWhitelistId(value));

      if (recipientAccountResponse?.payload?.success) {
        const data = recipientAccountResponse?.payload?.data;
        setFieldValue('network', data?.network);
        setFieldValue('recipientCurrency', data?.currency);
        setFieldValue('vaspName', data?.vaspName);
        setFieldValue('corporateName', data?.corporateName);
        setFieldValue('recipientId', data?.id);
        setFieldValue('walletAddress', data?.walletAddress);
        setFieldValue('channel', data?.channel);
        setFieldValue('entityType', data?.entity);

        if (data?.memoTag?.trim() === 'XML' || data?.memoTag?.trim() === 'XRP') {
          setFieldValue('memoTag', data?.memoTag);
        }
        if (data?.channel === 'VASP') {
          setFieldValue('vaspName', data?.vaspName);
        }
        if (data?.entity === 'CORPORATE') {
          setFieldValue('corporateName', data?.corporateName);
        }
      }
    }
  };

  const fetchFormApis = async () => {
    await dispatch(getLpWhitelistActiveList());
    await dispatch(getLPQuickTransaction());
    await dispatch(getLpBalance());
  };

  const handleSubmit = async (data: any, { resetForm }: any) => {
    if (data) {
      await dispatch(
        addLPQuickTransaction({
          senderLP: data.senderId,
          lpCurrency: data.senderLPCurrency,
          lpWhiteListId: data.recipientId,
          amount: data.transferAmount,
          comment: data.comment,
        })
      );
    }
    await dispatch(getLPQuickTransaction());
    resetForm();
    onFormReset();
    onClose();
  };

  const handleCreate = async () => {
    if (formikRef.current) {
      const formValues = formikRef.current.values;
      await dispatch(
        addLpTransaction({
          senderLP: formValues.senderLP,
          lpCurrency: formValues.senderLPCurrency,
          lpWhiteListId: formValues.recipientId,
          amount: +formValues.transferAmount,
          comment: formValues.comment && formValues.comment.trim() !== '' ? formValues.comment : '',
        })
      );
      await dispatch(getLPQuickTransaction());
    }
  };

  const handleSelectRow = async (data: any) => {
    if (formikRef.current) {
      const selectedSender = senderLpEnum.find((item: any) => item.label.toLowerCase() === data.senderLP.toLowerCase());
      const selectedRecipient = filterWhiteListAccountsdData.find((item: any) => item.accountName === data.recipient);

      await formikRef.current.setValues({
        senderLP: selectedSender?.value,
        senderId: selectedSender?.value,
        recipient: data.recipient,
        recipientId: selectedRecipient?.id,
        transferAmount: data.transferAmount,
        walletAddress: data.walletAddress,
        memoTag: data.memoTag,
        vaspName: data.vaspName,
        senderLPCurrency: data.senderLPCurrency,
        recipientCurrency: data.recipientCurrency,
        network: data.network,
        channel: data.channel,
        entityType: data.entityType,
        corporateName: data.coporateName,
        comment: data.comment,
      });

      await formikRef.current.validateForm();
      await fetchFormApis();
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
    fetchFormApis();
  }, [dispatch]);

  return (
    <section className={styles['c-lp-transfer']}>
      <CustomModal title={t('deleteQuickTransfer')} isVisible={isDeleteModalVisible} onClose={handleCloseDeleteModal} width='25%'>
        <DeleteForm selectedRowData={selectedRowData} onClose={handleCloseDeleteModal} />
      </CustomModal>
      {createTrue && (
        <>
          <div className={styles['c-lp-transfer__add-transfer']}>
            <PageTitle type='data' svg={<ILpTransfer />} title={t('lpTransfer')} />
            <Formik
              enableReinitialize={true}
              innerRef={formikRef}
              initialValues={AddTransferInitialValue()}
              validationSchema={AddTransferValidationSchema}
              validateOnChange={true}
              onSubmit={handleSubmit}
              validateOnBlur={true}>
              {({ values, setFieldValue, handleSubmit, errors }: FormikProps<any>) => {
                const getFilteredRecipients = () => {
                  if (!values?.senderLP || !filterWhiteListAccountsdData) {
                    return filterWhiteListAccountsdData || [];
                  }

                  const selectedLp = senderLpEnum.find((item: any) => item.value === values.senderLP);

                  if (!selectedLp) {
                    return filterWhiteListAccountsdData;
                  }

                  const lpLabel = selectedLp.label.toLowerCase();
                  return filterWhiteListAccountsdData.filter((item: any) => {
                    if (!item?.lpName) return false;
                    return item.lpName?.toLowerCase() === lpLabel;
                  });
                };

                const filteredRecipients = getFilteredRecipients();

                const isFormValid = (values.senderLP !== undefined || values.senderLP !== null) && values.recipient && values.transferAmount && Object.keys(errors).length === 0;

                let availableBalance: number | null = null;
                if (values.senderLP && values.senderLPCurrency && lpBalanceData) {
                  const selectedSender = senderLpEnum.find((item: any) => item.value === values.senderLP);
                  if (selectedSender) {
                    const filteredData = lpBalanceData.find((item: any) => item.lpName?.toLowerCase() === selectedSender.label?.toLowerCase() && item.currency === values.senderLPCurrency);
                    availableBalance = filteredData?.avaiableBalance || null;
                  }
                }

                return (
                  <Form name='lpTransfer' layout='vertical' onFinish={handleSubmit} className={styles['c-lp-transfer__add-transfer__form']}>
                    <CCard body='treasury' nonborder>
                      <Row align={'middle'} gutter={18}>
                        <Col span={4}>
                          <Form.Item name='senderLP' label={t('senderLp')} validateStatus={errors?.senderLP ? 'error' : ''} hasFeedback={!!errors?.senderLP}>
                            <Select
                              showSearch
                              optionFilterProp='label'
                              value={values?.senderLP}
                              onChange={(value) => {
                                handleFieldChange('senderLP', value, setFieldValue);
                                dispatch(postLPTransactionCurrencies({ lpNameId: value }));
                              }}
                              placeholder={t('senderLp')}>
                              {senderLpEnum?.map((item: any) => {
                                return (
                                  <Select.Option key={item?.value} value={item?.value} label={item?.label}>
                                    {item?.label}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item name='recipient' label={t('recipient')} validateStatus={errors?.recipient ? 'error' : ''} hasFeedback={!!errors?.recipient}>
                            <Select
                              showSearch
                              optionFilterProp='label'
                              value={values?.recipient}
                              onChange={(value) => handleFieldChange('recipient', value, setFieldValue)}
                              placeholder={t('recipient')}>
                              {filteredRecipients?.map((item: any) => {
                                return (
                                  <Select.Option key={item?.id} value={item?.id} label={item?.accountName}>
                                    {item?.accountName}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            name='transferAmount'
                            label={t('transferAmount')}
                            extra={availableBalance !== null ? <span className={styles['c-lp-transfer__max-balance']}>Max : {availableBalance}</span> : undefined}
                            validateStatus={errors?.transferAmount ? 'error' : ''}
                            hasFeedback={!!errors?.transferAmount}>
                            <Input
                              defaultValue={values?.transferAmount}
                              value={values?.transferAmount}
                              type='number'
                              placeholder={t('transferAmount')}
                              min={1}
                              onChange={(event) => setFieldValue('transferAmount', event.target.value)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item name='walletAddress' label={t('walletAddress')} validateStatus={errors?.walletAddress ? 'error' : ''} hasFeedback={!!errors?.walletAddress}>
                            <Input defaultValue={values?.walletAddress} value={values?.walletAddress} type='text' placeholder={t('walletAddress')} readOnly />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item name='memoTag' label={t('memoTag')} validateStatus={errors?.memoTag ? 'error' : ''} hasFeedback={!!errors?.memoTag}>
                            <Input defaultValue={values?.memoTag} value={values?.memoTag} type='text' placeholder={t('memoTag')} readOnly />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item name='vaspName' label={t('vaspName')} validateStatus={errors?.vaspName ? 'error' : ''} hasFeedback={!!errors?.vaspName}>
                            <Input defaultValue={values?.vaspName} value={values?.vaspName} type='text' placeholder={t('vaspName')} readOnly />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item name='senderLpCurrency' label={t('senderLpCurrency')} validateStatus={errors?.senderLPCurrency ? 'error' : ''} hasFeedback={!!errors?.senderLPCurrency}>
                            <Select
                              showSearch
                              optionFilterProp='label'
                              value={values?.senderLPCurrency}
                              onChange={async (value) => {
                                handleFieldChange('senderLPCurrency', value, setFieldValue);
                                await dispatch(postLPTransactionNetworks({ lpNameId: values?.senderLP, currencyName: value }));
                              }}
                              placeholder={t('senderLpCurrency')}
                              options={currenciesList?.map((item: any) => ({ label: item, value: item }))}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item name='recipientCurrency' label={t('recipientCurrency')} validateStatus={errors?.recipientCurrency ? 'error' : ''} hasFeedback={!!errors?.recipientCurrency}>
                            <Input
                              defaultValue={values.recipientCurrency}
                              value={values.recipientCurrency}
                              type='text'
                              placeholder={t('recipientCurrency')}
                              onChange={(e) => setFieldValue('recipientCurrency', e.target.value)}
                              readOnly
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item name='network' label={t('network')} validateStatus={errors?.network ? 'error' : ''} hasFeedback={!!errors?.network}>
                            <Input defaultValue={values?.network} value={values?.network} type='text' placeholder={t('network')} readOnly />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item name='channel' label={t('channel')} validateStatus={errors?.channel ? 'error' : ''} hasFeedback={!!errors?.channel}>
                            <Input defaultValue={values?.channel || ''} value={values?.channel || ''} type='text' placeholder={t('channel')} readOnly />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item name='entityType' label={t('entityType')} validateStatus={errors?.entityType ? 'error' : ''} hasFeedback={!!errors?.entityType}>
                            <Select
                              showSearch
                              optionFilterProp='label'
                              value={values?.entityType}
                              onChange={(value) => {
                                setFieldValue('entityType', value);
                                if (value !== 'CORPORATE') {
                                  setFieldValue('corporateName', '');
                                }
                              }}
                              placeholder={t('entityType')}
                              options={entityTypeEnum ?? []}
                              disabled={true}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item name='corporateName' label={t('corporateName')} validateStatus={errors?.corporateName ? 'error' : ''} hasFeedback={!!errors?.corporateName}>
                            <Input
                              defaultValue={values.corporateName}
                              value={values.corporateName}
                              type='text'
                              placeholder={t('corporateName')}
                              onChange={(e) => setFieldValue('corporateName', e.target.value)}
                              readOnly
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row align={'middle'} gutter={18}>
                        <Col span={4}>
                          <Form.Item name='comment' label={t('comment')} validateStatus={errors?.comment ? 'error' : ''} hasFeedback={!!errors?.comment}>
                            <Input defaultValue={values?.comment} value={values?.comment} type='text' placeholder={t('comment')} onChange={(e) => setFieldValue('comment', e.target.value)} />
                          </Form.Item>
                        </Col>

                        <Col span={20} className={styles['c-lp-transfer__button-area']}>
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
          <div className={styles['c-lp-transfer__quick-transfer']}>
            <PageTitle type='data' svg={<PiHandWithdraw />} title={t('quickTransfer')} />
            <CDataGrid
              gridKey={'quickTransfer'}
              pTitle='TreasuryTransfer'
              addLogicVisible={false}
              data={quickLpTransactionData}
              columns={lpQuickTransferColumns}
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
      <div className={styles['c-lp-transfer__balances']}>
        <PageTitle type='data' svg={<PiBank />} title={t('balance')} />
        {!createTrue && <CSpace type='tt'></CSpace>}
        <CDataGrid
          gridKey={'accountStorage'}
          pTitle='TreasuryTransfer'
          addLogicVisible={false}
          data={lpBalanceData}
          columns={lpBalancesColumns}
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
export default LpTransfer;
