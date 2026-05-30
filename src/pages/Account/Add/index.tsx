import { useEffect, useRef } from 'react';
import { Col, Form, Input, Row, Select, Switch } from 'antd';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addBankAccount, getBankAccount } from '../../../store/bankAccount';
import { getPriorities } from '../../../store/priority';
import { getBankData } from '../../../store/bank';
import { accountTypeEnum } from '../../../db/Enums';
import { AddGeneralFormProps, AddAccountsProps } from '../../../dbProps';
import CCard from '../../../components/CCard';
import ButtonArea from '../../../components/ButtonArea';
import CErrorMessage from '../../../components/CErrorMessage';
import { AddAValidationSchema, AddInitialValue } from '../Validation';
import CloseOutlined from '../../../assets/svg/CloseOutlined.svg?react';
import CheckOutlined from '../../../assets/svg/CheckOutlined.svg?react';
import styles from '../styles.module.scss';

const AddAccount: React.FC<AddGeneralFormProps> = ({ onClose, onFormReset, shouldResetForm }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formikRef = useRef<FormikProps<AddAccountsProps>>(null);
  const bankData = useAppSelector((state) => state?.bankValue?.data?.data);
  const priorityData = useAppSelector((state) => state.prioritiesValue?.data?.data);
  const seen = new Set();
  const priorityEnum =
    priorityData
      ?.map((priority: { toString: () => string }) => ({
        value: priority,
        label: priority.toString(),
      }))
      .filter((item: any) => {
        if (seen.has(item.label)) return false;
        seen.add(item.label);
        return true;
      }) || [];

  const submitHandler = async (data: AddAccountsProps, { resetForm }: any) => {
    const accountType = data.accountType === 'Withdraw' ? 1 : 2;
    await dispatch(
      addBankAccount({
        iban: 'TR' + data.iban,
        accountNo: data.accountNo,
        accountName: data.accountName,
        companyBankId: data.selectBank,
        priority: data.precedence,
        status: data.accountEnable === true ? 1 : 0,
        accountHolderName: data.accountHolderName,
        vkn: data.vkn,
        accountType: data.accountType ? accountType : null,
      })
    );
    await dispatch(getBankAccount());

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
      await dispatch(getBankData());
      await dispatch(getPriorities());
    };
    fetchFormApis();
  }, []);

  return (
    <section className={styles['c-accountAdd']}>
      <Formik
        innerRef={formikRef}
        initialValues={AddInitialValue()}
        validationSchema={AddAValidationSchema}
        validateOnChange={true}
        onSubmit={submitHandler}
        validateOnBlur={true}
        validator={() => ({})}>
        {({ values, setFieldValue, errors, handleSubmit }) => (
          <Form name='add-account' layout='vertical' onFinish={handleSubmit}>
            <CCard paddingOn>
              <Row align={'top'} gutter={36}>
                <Col span={12}>
                  <Form.Item name='selectBank' label={t('select_bank')}>
                    <Select
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input: any, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                      filterSort={(optionA: any, optionB: any) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                      value={values.selectBank}
                      defaultValue={values.selectBank}
                      onChange={(value) => setFieldValue('selectBank', value)}
                      placeholder={t('select_bank')}>
                      {bankData?.map((banks: any) => {
                        return (
                          <Select.Option label={banks?.bankName} value={banks?.id} key={banks?.id}>
                            {banks?.bankName}
                          </Select.Option>
                        );
                      })}
                    </Select>
                    <CErrorMessage errorMessage={errors.selectBank} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='accountNo' label={t('account_no')}>
                    <Input
                      placeholder={t('account_no')}
                      value={values.accountNo}
                      onChange={(event) => {
                        const newValue = event.target.value.replace(/[^0-9-]/g, '');
                        setFieldValue('accountNo', newValue);
                      }}
                    />
                    <CErrorMessage errorMessage={errors.accountNo} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='iban' label={t('iban')}>
                    <Input
                      value={`TR${values.iban || ''}`}
                      onChange={(event) => {
                        const numericValue = event.target.value.replace(/^TR/, '').replace(/\D/g, '');
                        setFieldValue('iban', numericValue);
                      }}
                      placeholder='TR'
                      maxLength={26}
                    />
                    <CErrorMessage errorMessage={errors.iban} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='accountName' label={t('account_name')}>
                    <Input value={values.accountName} onChange={(event) => setFieldValue('accountName', event.target.value)} type='text' placeholder={t('account_name')} />
                    <CErrorMessage errorMessage={errors.accountName} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='accountHolderName' label={t('accountHolderName')}>
                    <Input value={values.accountHolderName} onChange={(event) => setFieldValue('accountHolderName', event.target.value)} type='text' placeholder={t('accountHolderName')} />
                    <CErrorMessage errorMessage={errors.accountHolderName} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='vkn' label={t('vkn')}>
                    <Input value={values.vkn} onChange={(event) => setFieldValue('vkn', event.target.value)} type='text' placeholder={t('vkn')} />
                    <CErrorMessage errorMessage={errors.vkn} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='precedence' label={t('precedence')}>
                    <Select
                      className={styles['c-accountAdd__selectbox']}
                      optionFilterProp='children'
                      value={values.precedence}
                      onChange={(value) => setFieldValue('precedence', value)}
                      placeholder={t('precedence')}
                      options={priorityEnum}
                      virtual={false}
                      disabled={!values?.accountEnable}
                    />
                    <CErrorMessage errorMessage={errors.precedence} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='accountEnable' label={t('account_enable')}>
                    <Switch
                      defaultChecked
                      defaultValue={values?.accountEnable}
                      value={values?.accountEnable}
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      onChange={(checked) => {
                        setFieldValue('accountEnable', checked);
                      }}
                    />
                    <CErrorMessage errorMessage={errors.accountEnable} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='accountType' label={t('accountType')}>
                    <Select
                      className={styles['c-accountAdd__selectbox']}
                      optionFilterProp='children'
                      value={values.accountType}
                      defaultValue={values.accountType}
                      onChange={(value) => setFieldValue('accountType', value)}
                      placeholder={t('accountType')}
                      options={accountTypeEnum}
                      virtual={false}
                    />
                    <CErrorMessage errorMessage={errors.accountType} />
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
    </section>
  );
};
export default AddAccount;
