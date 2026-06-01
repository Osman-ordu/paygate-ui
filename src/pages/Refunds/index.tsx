import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, DatePicker, Select } from 'antd';
import { toast } from 'react-toastify';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { Formik, FormikProps } from 'formik';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getEftRefundList } from '../../store/eftRefundList';
import { transferTimeEnum } from '../../db/Enums';
import { refundsColumns } from '../../db/Columns';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid/Lazy';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { RefundsInitialValue, RefundsValidationSchema } from './Validation';
import ILpTransfer from '../../assets/svg/LpTransfer.svg?react';
import styles from './styles.module.scss';

const Refunds = ({ onFormReset, shouldResetForm }: any) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.getEftRefundListValue?.data?.data);
  const isLoading = useAppSelector((state) => state.getEftRefundListValue?.isLoading);
  const formikRef = useRef<FormikProps<any>>(null);
  const arrStore = useRef(
    new ArrayStore({
      key: 'id',
      data: [],
    })
  ).current;
  const [dataSource] = useState(
    new DataSource({
      reshapeOnPush: true,
      store: arrStore,
    })
  );

  const handleExportExcel = async () => {
    const { exportToExcel } = await import('../../utils/excel-export');
    exportToExcel('refunds', dataSource.items(), 'refunds.xlsx', t);
  };

  const submitHandler = async ({ date, startDate, endDate }: any) => {
    if (date === 1) {
      dispatch(getEftRefundList({ startTime: startDate, endTime: endDate }));
      return;
    }

    const now = dayjs();
    let startDateVal;
    let endDateVal = now;

    if (date) {
      switch (date) {
        case 2:
          startDateVal = now.startOf('day');
          break;
        case 3:
          startDateVal = now.subtract(1, 'day').startOf('day');
          endDateVal = now.startOf('day');
          break;
        case 4:
          startDateVal = now.startOf('week').add(1, 'day').startOf('day');
          break;
        case 5:
          startDateVal = now.startOf('month');
          break;
        default:
          toast.error('Invalid date value');
          return;
      }
    } else {
      startDateVal = dayjs(startDate);
      endDateVal = dayjs(endDate);

      if (startDateVal.isAfter(endDateVal)) {
        toast.error(t('isAfterStartMessage'));
        return;
      }
    }

    dispatch(
      getEftRefundList({
        startTime: startDateVal.add(3, 'hour').toISOString(),
        endTime: endDateVal.add(3, 'hour').toISOString(),
      })
    );
  };

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  useEffect(() => {
    const fetchRefunds = async () => {
      await dispatch(
        getEftRefundList({
          startTime: dayjs().startOf('day').add(3, 'hour').toISOString(),
          endTime: dayjs().add(3, 'hour').toISOString(),
        })
      );
    };
    fetchRefunds();
  }, []);

  useEffect(() => {
    if (Array.isArray(data)) {
      arrStore.clear();
      arrStore.push(
        data?.map((item: any) => ({
          type: 'insert',
          data: {
            ...item,
          },
        }))
      );
      dataSource.reload();
    }
  }, [data, arrStore, dataSource]);

  return (
    <section className={styles['c-refunds']}>
      <PageTitle type='normal' title={t('eftRefunds')} svg={<ILpTransfer />} />
      <Formik innerRef={formikRef} initialValues={RefundsInitialValue()} validationSchema={RefundsValidationSchema} validateOnChange={true} onSubmit={submitHandler} validateOnBlur={true}>
        {({ values, setFieldValue, handleSubmit }) => (
          <Form name='eft-refunds' layout='vertical' onFinish={handleSubmit}>
            <Row align={'middle'} gutter={18}>
              <Col>
                <Form.Item name='startDate' label={t('startDate')}>
                  <DatePicker
                    defaultValue={dayjs(values?.startDate)}
                    showTime={false}
                    format='DD/MM/YYYY'
                    value={dayjs(values?.startDate)}
                    onChange={(date) => setFieldValue('startDate', date?.toISOString())}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name='endDate' label={t('endDate')}>
                  <DatePicker
                    defaultValue={dayjs(values?.endDate)}
                    showTime={false}
                    format='DD/MM/YYYY'
                    value={dayjs(values?.endDate)}
                    onChange={(date) => setFieldValue('endDate', date?.toISOString())}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name='date' label={t('date')}>
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 175 }}
                    optionFilterProp='children'
                    value={values?.type}
                    onChange={(value) => setFieldValue('date', value)}
                    placeholder={t('date')}
                    options={transferTimeEnum}
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
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <CDataGrid
            gridKey={'refund'}
            pTitle='Refund'
            data={dataSource}
            columns={refundsColumns}
            columnFilter={true}
            columnChooserButtonVisible={false}
            stateStore='NO'
            addLogicVisible={false}
            editButtonVisible={false}
            deleteButtonVisible={false}
            refreshVisible={false}
            height='71vh'
            excelExportVisible={true}
            handleExportExcel={handleExportExcel}
          />
        </>
      )}
    </section>
  );
};

export default Refunds;
