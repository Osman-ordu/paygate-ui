import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { Col, Form, Row, Select, DatePicker } from 'antd';
import { toast } from 'react-toastify';
import { Formik, FormikProps } from 'formik';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getBankAccountConsensus } from '../../store/bankAccountConsensus';
import { ConsensusInitialValue, ConsensusValidationSchema } from './Validation';
import { ConsensusFormProps, ConsensusProps } from '../../dbProps';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import CErrorMessage from '../../components/CErrorMessage';
import PiHandShake from '../../assets/svg/PiHandShake.svg?react';
import styles from './styles.module.scss';

const Consensus: React.FC<ConsensusFormProps> = ({ onFormReset, shouldResetForm }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const bankAcountConsensusData = useAppSelector((state) => state.getBankAccountConsensusValue?.data);
  const isLoading = useAppSelector((state) => state.getBankAccountConsensusValue?.isLoading);
  const formikRef = useRef<FormikProps<ConsensusProps>>(null);
  const { currency, startDate, endDate } = ConsensusInitialValue();

  useEffect(() => {
    if (currency && startDate && endDate) {
      dispatch(getBankAccountConsensus({ currency, startDate, endDate }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  const submitHandler = async (data: ConsensusProps) => {
    const { currency, startDate, endDate } = data;
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (start.isAfter(end)) {
      toast.error(t('isAfterStartMessage'));
      return;
    }

    const difference = end.diff(start, 'day');

    if (difference > 7) {
      toast.error(t('diffMessage'));
      return;
    }

    await dispatch(
      getBankAccountConsensus({
        currency,
        startDate,
        endDate,
      })
    );
  };

  const consensusColumns = [
    { dataField: 'bankName', caption: 'bank', addition: { allowSorting: true } },
    { dataField: 'currency', caption: 'currency', addition: { allowSorting: true } },
    {
      dataField: 'depositAmount',
      caption: 'deposit_amount',
      addition: {
        allowSorting: true,
        format: (value: number) => {
          return new Intl.NumberFormat('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
        },
      },
    },
    {
      dataField: 'withdrawAmount',
      caption: 'withdraw_amount',
      addition: {
        allowSorting: true,
        format: (value: number) => {
          return new Intl.NumberFormat('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
        },
      },
    },
    // { dataField: 'startDate', caption: 'start_date', addition: { allowSorting: true } },  // Bu field response'ta bulunmamakta
    // { dataField: 'endDate', caption: 'end_date', addition: { allowSorting: true } },      // Bu field response'ta bulunmamakta
    { dataField: 'accountName', caption: 'account_name', addition: { allowSorting: true } },
  ];

  const currencyEnum = [
    { value: 'TRY', label: 'TRY' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
  ];

  return (
    <section>
      <PageTitle type='data' svg={<PiHandShake />} title={t('consensus')} />
      <Formik innerRef={formikRef} initialValues={ConsensusInitialValue()} validationSchema={ConsensusValidationSchema} validateOnChange={true} onSubmit={submitHandler} validateOnBlur={true}>
        {({ values, setFieldValue, errors, handleSubmit }) => (
          <Form className={styles['c-consensusform']} name='consensus' layout='vertical' onFinish={handleSubmit}>
            <Row align={'middle'} gutter={18}>
              <Col>
                <Form.Item name='currency' label={t('currency')}>
                  <Select
                    showSearch
                    optionFilterProp='label'
                    value={values?.currency}
                    onChange={(value) => setFieldValue('currency', value)}
                    placeholder={t('currency')}
                    options={currencyEnum ?? []}
                  />
                  <CErrorMessage errorMessage={errors.currency} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name='startDate' label={t('startDate')}>
                  <DatePicker
                    defaultValue={dayjs(values?.startDate)}
                    showTime={{ format: 'HH:mm' }}
                    format='DD/MM/YYYY HH:mm'
                    value={dayjs(values?.startDate)}
                    onChange={(date) => setFieldValue('startDate', date?.toISOString())}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name='endDate' label={t('endDate')}>
                  <DatePicker
                    defaultValue={dayjs(values?.endDate)}
                    showTime={{ format: 'HH:mm' }}
                    format='DD/MM/YYYY HH:mm'
                    value={dayjs(values?.endDate)}
                    onChange={(date) => setFieldValue('endDate', date?.toISOString())}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Button type='primary' text={t('filter')} handleClick={handleSubmit} />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
      {isLoading && <Loader />}
      {!isLoading && (
        <CDataGrid
          gridKey={'consensusStorage'}
          pTitle='Consensus'
          addLogicVisible={false}
          data={bankAcountConsensusData?.data}
          columns={consensusColumns}
          columnFilter={true}
          stateStore='NO'
          editButtonVisible={false}
          deleteButtonVisible={false}
          refreshVisible={false}
          height={'71vh'}
        />
      )}
    </section>
  );
};

export default Consensus;
