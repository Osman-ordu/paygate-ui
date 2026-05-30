import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, Row, Select, Switch } from 'antd';
import { Formik, FormikProps } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { editBankAccount, getBankAccount } from '../../../store/bankAccount';
import { getBankData } from '../../../store/bank';
import { getPriorities } from '../../../store/priority';
import { accountTypeEnum } from '../../../db/Enums';
import CCard from '../../../components/CCard';
import ButtonArea from '../../../components/ButtonArea';
import CErrorMessage from '../../../components/CErrorMessage';
import { EditInitialValue, EditValidationSchema } from '../Validation';
import { EditAccountsProps, EditGeneralFormProps } from '../../../dbProps';
import CheckOutlined from '../../../assets/svg/CheckOutlined.svg?react';
import CloseOutlined from '../../../assets/svg/CloseOutlined.svg?react';

const EditAccountsForm: React.FC<EditGeneralFormProps> = ({ onClose, onFormReset, shouldResetForm, selectedRowData }) => {
  const { t } = useTranslation();
  const formikRef = useRef<FormikProps<EditAccountsProps>>(null);
  const dispatch = useAppDispatch();
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

  const submitHandler = async (data: EditAccountsProps, { resetForm }: any) => {
    const accountType = data.accountType === 'Withdraw' ? 1 : 2;
    await dispatch(
      editBankAccount({
        id: data?.id,
        priority: data.precedence,
        accountName: data.account_name,
        status: data.account_enable === true ? 1 : 0,
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
    <Formik
      enableReinitialize={true}
      innerRef={formikRef}
      initialValues={EditInitialValue(selectedRowData)}
      validationSchema={EditValidationSchema}
      validateOnChange={true}
      onSubmit={submitHandler}
      validateOnBlur={true}
      validator={() => ({})}>
      {({ values, setFieldValue, errors, handleSubmit }) => (
        <Form name='edit-account' layout='vertical' onFinish={handleSubmit}>
          <CCard paddingOn>
            <Row align={'top'} gutter={36}>
              <Col span={12}>
                <Form.Item name='select_bank' label={t('select_bank')}>
                  <>
                    <Select
                      disabled
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input: any, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                      filterSort={(optionA: any, optionB: any) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                      value={values?.select_bank}
                      defaultValue={values?.select_bank}
                      onChange={(event) => setFieldValue('select_bank', event.target.value)}
                      placeholder={t('select_bank')}>
                      {bankData?.map((banks: any) => {
                        return (
                          <Select.Option label={banks?.bankName} value={banks?.id} key={banks?.id}>
                            {banks?.bankName}
                          </Select.Option>
                        );
                      })}
                    </Select>
                    <CErrorMessage errorMessage={errors.select_bank} />
                  </>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='account_no' label={t('account_no')}>
                  <Input
                    disabled
                    value={values?.account_no}
                    onChange={(event) => {
                      const newValue = event.target.value.replace(/[^0-9-]/g, '');
                      setFieldValue('account_no', newValue);
                    }}
                    type='number'
                    placeholder={t('account_no')}
                  />
                  <CErrorMessage errorMessage={errors.account_no} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='iban' label={t('iban')}>
                  <Input disabled value={values?.iban} onChange={(event) => setFieldValue('iban', event.target.value)} type='text' placeholder={t('iban')} />
                  <CErrorMessage errorMessage={errors.iban} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='account_name' label={t('account_name')}>
                  <Input
                    defaultValue={values?.account_name}
                    value={values?.account_name}
                    onChange={(event) => setFieldValue('account_name', event.target.value)}
                    type='text'
                    placeholder={t('account_name')}
                  />
                  <CErrorMessage errorMessage={errors.account_name} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='accountHolderName' label={t('accountHolderName')}>
                  <Input value={values?.accountHolderName} onChange={(event) => setFieldValue('accountHolderName', event.target.value)} type='text' placeholder={t('accountHolderName')} />
                  <CErrorMessage errorMessage={errors.accountHolderName} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='vkn' label={t('vkn')}>
                  <Input value={values?.vkn} onChange={(event) => setFieldValue('vkn', event.target.value)} type='text' placeholder={t('vkn')} />
                  <CErrorMessage errorMessage={errors.vkn} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='precedence' label={t('precedence')}>
                  <Select
                    optionFilterProp='children'
                    value={values?.precedence}
                    onChange={(value) => setFieldValue('precedence', value)}
                    placeholder={t('precedence')}
                    options={priorityEnum}
                    virtual={false}
                    disabled={!values?.account_enable}
                  />
                  <CErrorMessage errorMessage={errors.precedence} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='account_enable' label={t('account_enable')}>
                  <Switch
                    defaultChecked
                    value={values?.account_enable}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    onChange={(checked) => {
                      setFieldValue('account_enable', checked);
                    }}
                  />
                  <CErrorMessage errorMessage={errors.account_enable} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='accountType' label={t('accountType')}>
                  <Select
                    optionFilterProp='children'
                    value={values.accountType}
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
              <ButtonArea cancelClick={() => onClose()} submitTitle='save' />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};
export default EditAccountsForm;
