import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { Col, Form, Input, Row, Select, DatePicker } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addLpWhitelist, getLpOkxVaspList, getLpWhitelist, getLpWhitelistActiveList } from '../../../store/lpWhitelist/index.ts';
import { postLPTransactionCurrencies, postLPTransactionNetworks } from '../../../store/LPTransaction';
import CCard from '../../../components/CCard';
import CErrorMessage from '../../../components/CErrorMessage';
import ButtonArea from '../../../components/ButtonArea';
import { channelEnum, countryEnum, entityEnum, senderLpEnum, targetTypeEnum } from '../../../db/Enums';
import { addInitialValue, validationSchema } from '../Validation';

export default function AddForm({ onClose, onFormReset, shouldResetForm }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formikRef: any = useRef(null);
  const currenciesList = useAppSelector((state: any) => state.postLPTransactionCurrenciesValue?.data?.data);
  const networksList = useAppSelector((state: any) => state.postLPTransactionNetworksValue?.data?.data);
  const okxVaspList = useAppSelector((state: any) => state.getLpOkxVaspListValue?.data?.data);

  const handleFieldChange = async (fieldName: string, value: any, setFieldValue: any, values: any) => {
    setFieldValue(fieldName, value);

    if (fieldName === 'lpName') {
      setFieldValue('currencyOfTheAccount', null);
      setFieldValue('network', null);
      setFieldValue('walletAddress', null);
      await dispatch(postLPTransactionCurrencies({ lpNameId: value }));

      if (value === 3) {
        await dispatch(getLpOkxVaspList());
      }
    }

    if (fieldName === 'currencyOfTheAccount') {
      setFieldValue('network', null);
      setFieldValue('walletAddress', null);
      await dispatch(postLPTransactionNetworks({ lpNameId: values?.lpName, currencyName: value }));
    }
  };

  const submitHandler = async (data: any, { resetForm }: any) => {
    await dispatch(
      addLpWhitelist({
        accountName: data.accountName,
        lpName: data.lpName,
        currency: data.currencyOfTheAccount,
        walletAddress: data.walletAddress,
        network: data.network,
        memoTag: data.memoTag || null,
        channel: data.channel,
        vaspName: data.vaspName || null,
        entity: data.entity,
        corporateName: data.corporateName || null,
        corporateAddress: data.corporateAddress || null,
        description: data.description,
        name: data.name || null,
        surname: data.surname || null,
        birthdate: data.birthdate || null,
        targetType: data.targetType,
        innerToType: data.innerToType || null,
        country: data.country || null,
        city: data.city || null,
        district: data.district || null,
        streetName: data.streetName || null,
      })
    );
    await dispatch(getLpWhitelist());
    resetForm();
    onFormReset();
    onClose();
  };

  useEffect(() => {
    dispatch(getLpWhitelistActiveList());
  }, [dispatch]);

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  return (
    <Formik innerRef={formikRef} initialValues={addInitialValue()} validationSchema={validationSchema} validateOnChange={true} onSubmit={submitHandler} validateOnBlur={true}>
      {({ values, setFieldValue, errors, handleSubmit }) => {
        return (
          <Form name='add-lp-whitelisted' layout='vertical' onFinish={handleSubmit}>
            <CCard paddingOn>
              <Row align={'top'} gutter={36}>
                <Col span={12}>
                  <Form.Item name='accountName' label={t('accountName')}>
                    <>
                      <Input value={values.accountName} onChange={(event) => setFieldValue('accountName', event.target.value)} type='text' placeholder={t('accountName')} />
                      <CErrorMessage errorMessage={errors.accountName} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='lpName' label={t('lpName')}>
                    <>
                      <Select showSearch optionFilterProp='label' value={values?.lpName} onChange={(value) => handleFieldChange('lpName', value, setFieldValue, values)} placeholder={t('lpName')}>
                        {senderLpEnum?.map((item: any) => {
                          return (
                            <Select.Option key={item?.value} value={item?.value} label={item?.label}>
                              {item?.label}
                            </Select.Option>
                          );
                        })}
                      </Select>
                      <CErrorMessage errorMessage={errors.lpName} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='currencyOfTheAccount' label={t('currencyOfTheAccount')}>
                    <>
                      <Select
                        showSearch
                        optionFilterProp='label'
                        value={values?.currencyOfTheAccount}
                        onChange={(value) => handleFieldChange('currencyOfTheAccount', value, setFieldValue, values)}
                        placeholder={t('currencyOfTheAccount')}
                        disabled={!senderLpEnum?.map((item: any) => item.value).includes(values?.lpName)}>
                        {currenciesList &&
                          currenciesList?.map((currency: string) => {
                            return (
                              <Select.Option key={currency} value={currency} label={currency}>
                                {currency}
                              </Select.Option>
                            );
                          })}
                      </Select>
                      <CErrorMessage errorMessage={errors.currencyOfTheAccount} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='walletAddress' label={t('walletAddress')}>
                    <>
                      <Input value={values.walletAddress} onChange={(event) => setFieldValue('walletAddress', event.target.value)} type='text' placeholder={t('walletAddress')} />
                      <CErrorMessage errorMessage={errors.walletAddress} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='network' label={t('network')}>
                    <>
                      <Select
                        showSearch
                        optionFilterProp='label'
                        value={values?.network}
                        onChange={(value) => setFieldValue('network', value)}
                        placeholder={t('network')}
                        disabled={!values?.currencyOfTheAccount}>
                        {networksList?.map((network: string) => {
                          return (
                            <Select.Option key={network} value={network} label={network}>
                              {network}
                            </Select.Option>
                          );
                        })}
                      </Select>
                      <CErrorMessage errorMessage={errors.network} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='memoTag' label={t('memoTag')}>
                    <>
                      <Input value={values.memoTag} onChange={(event) => setFieldValue('memoTag', event.target.value)} type='text' placeholder={t('memoTag')} />
                      <CErrorMessage errorMessage={errors.memoTag} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='channel' label={t('channel')}>
                    <>
                      <Select showSearch optionFilterProp='label' value={values?.channel} onChange={(value) => setFieldValue('channel', value)} placeholder={t('channel')}>
                        {channelEnum?.map((item: any) => {
                          return (
                            <Select.Option key={item?.value} value={item?.value} label={item?.label}>
                              {item?.label}
                            </Select.Option>
                          );
                        })}
                      </Select>
                      <CErrorMessage errorMessage={errors.channel} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='vaspName' label={t('vaspName')}>
                    {values?.lpName === 3 && values?.channel === 0 ? (
                      <>
                        <Select showSearch optionFilterProp='label' value={values?.vaspName} onChange={(value) => setFieldValue('vaspName', value)} placeholder={t('vaspName')}>
                          {okxVaspList?.map((item: any) => {
                            return (
                              <Select.Option key={item?.exchName} value={item?.exchName} label={item?.exchName}>
                                {item?.exchName}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </>
                    ) : (
                      <>
                        <Input
                          value={values.vaspName || ''}
                          onChange={(event) => setFieldValue('vaspName', event.target.value)}
                          type='text'
                          placeholder={t('vaspName')}
                          disabled={values?.channel !== 0}
                        />
                        <CErrorMessage errorMessage={errors.vaspName} />
                      </>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='targetType' label={t('targetType')}>
                    <>
                      <Select showSearch optionFilterProp='label' value={values?.targetType} onChange={(value) => setFieldValue('targetType', value)} placeholder={t('targetType')}>
                        {targetTypeEnum?.map((item: any) => {
                          return (
                            <Select.Option key={item?.value} value={item?.value} label={item?.label}>
                              {item?.label}
                            </Select.Option>
                          );
                        })}
                      </Select>
                      <CErrorMessage errorMessage={errors.targetType} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='innerToType' label={t('innerToType')}>
                    <>
                      <Input
                        value={values.innerToType}
                        onChange={(event) => setFieldValue('innerToType', event.target.value)}
                        type='text'
                        placeholder={t('innerToType')}
                        disabled={values.lpName !== 2 || values?.targetType !== 2}
                      />
                      <CErrorMessage errorMessage={errors.innerToType} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='entity' label={t('entity')}>
                    <>
                      <Select showSearch optionFilterProp='label' value={values?.entity} onChange={(value) => setFieldValue('entity', value)} placeholder={t('entity')}>
                        {entityEnum?.map((item: any) => {
                          return (
                            <Select.Option key={item?.value} value={item?.value} label={item?.label}>
                              {item?.label}
                            </Select.Option>
                          );
                        })}
                      </Select>
                      <CErrorMessage errorMessage={errors.entity} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='name' label={t('name')}>
                    <>
                      <Input value={values.name} onChange={(event) => setFieldValue('name', event.target.value)} type='text' placeholder={t('name')} disabled={values?.entity !== 0} />
                      <CErrorMessage errorMessage={errors.name} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='surname' label={t('surname')}>
                    <>
                      <Input value={values.surname} onChange={(event) => setFieldValue('surname', event.target.value)} type='text' placeholder={t('surname')} disabled={values?.entity !== 0} />
                      <CErrorMessage errorMessage={errors.surname} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='birthDate' label={t('birthDate')}>
                    <>
                      <DatePicker
                        style={{ width: '100%' }}
                        value={values.birthdate ? dayjs(values.birthdate, 'YYYY-MM-DD') : null}
                        onChange={(date) => setFieldValue('birthdate', date ? dayjs(date).format('YYYY-MM-DD') : '')}
                        placeholder={t('birthDate')}
                        disabled={values?.entity !== 0}
                        format='YYYY-MM-DD'
                      />
                      <CErrorMessage errorMessage={errors.birthdate} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='corporateName' label={t('corporateName')}>
                    <>
                      <Input
                        value={values.corporateName}
                        onChange={(event) => setFieldValue('corporateName', event.target.value)}
                        type='text'
                        placeholder={t('corporateName')}
                        disabled={values?.entity !== 1}
                      />
                      <CErrorMessage errorMessage={errors.corporateName} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='corporateAddress' label={t('corporateAddress')}>
                    <>
                      <Input
                        value={values.corporateAddress}
                        onChange={(event) => setFieldValue('corporateAddress', event.target.value)}
                        type='text'
                        placeholder={t('corporateAddress')}
                        disabled={values?.entity !== 1}
                      />
                      <CErrorMessage errorMessage={errors.corporateAddress} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='country' label={t('country')}>
                    <>
                      <Select
                        showSearch
                        optionFilterProp='label'
                        value={values?.country}
                        onChange={(value) => setFieldValue('country', value)}
                        placeholder={t('country')}
                        disabled={values?.lpName !== 3}>
                        {countryEnum?.map((item: any) => {
                          return (
                            <Select.Option key={item?.value} value={item?.value} label={item?.name}>
                              {item?.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                      <CErrorMessage errorMessage={errors.country} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='city' label={t('city')}>
                    <>
                      <Input value={values.city || ''} onChange={(event) => setFieldValue('city', event.target.value)} type='text' placeholder={t('city')} disabled={values?.lpName !== 3} />
                      <CErrorMessage errorMessage={errors.city} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='district' label={t('district')}>
                    <>
                      <Input
                        value={values.district || ''}
                        onChange={(event) => setFieldValue('district', event.target.value)}
                        type='text'
                        placeholder={t('district')}
                        disabled={values?.lpName !== 3}
                      />
                      <CErrorMessage errorMessage={errors.district} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='streetName' label={t('streetName')}>
                    <>
                      <Input
                        value={values.streetName || ''}
                        onChange={(event) => setFieldValue('streetName', event.target.value)}
                        type='text'
                        placeholder={t('streetName')}
                        disabled={values?.lpName !== 3}
                      />
                      <CErrorMessage errorMessage={errors.streetName} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='description' label={t('description')}>
                    <>
                      <Input value={values.description || ''} onChange={(event) => setFieldValue('description', event.target.value)} type='text' placeholder={t('description')} />
                      <CErrorMessage errorMessage={errors.description} />
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
        );
      }}
    </Formik>
  );
}
