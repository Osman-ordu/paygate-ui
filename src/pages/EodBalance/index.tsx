import { useEffect, useRef, useState } from 'react';
import { Row, Col, DatePicker, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getEodBalanceList } from '../../store/eodBalance';
import { exportToExcel } from '../../utils/excel-export';
import { eodBalanceSummaryColumns } from '../../db/Columns';
import CDataGrid from '../../components/CDataGrid';
import Button from '../../components/Button';
import PageTitle from '../../components/PageTitle';
import { toastError } from '../../components/Toast';
import CErrorMessage from '../../components/CErrorMessage';
import Loader from '../../components/Loader';
import CustomModal from '../../components/Modal';
import { EodBalanceInitialValue, EodBalanceValidationSchema } from './Validation';
import EditEodBalance from './Edit';
import BalanceHubSvg from '../../assets/svg/BalanceHub.svg?react';
import styles from './styles.module.scss';

export default function EodBalance({ onFormReset, shouldResetForm }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.getEodBalanceListValue?.data?.data);
  const isLoading = useAppSelector((state) => state.getEodBalanceListValue?.isLoading);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
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

  const handleOpenEditModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRowData(null);
  };

  const handleExportExcel = async () => {
    try {
      const filteredData = dataSource.items();
      exportToExcel('eodBalance', filteredData, 'eodBalance.xlsx', t);
    } catch (error) {
      toastError(t('exportError'));
    }
  };

  const submitHandler = async (values: any) => {
    const preparedDate = dayjs(values.eodDate).add(3, 'hour');
    const dateString = preparedDate.toISOString();
    await dispatch(getEodBalanceList({ date: dateString }));
  };

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  useEffect(() => {
    (async () => {
      // Load yesterday's data by default
      const preparedYesterday = dayjs().subtract(1, 'day').add(3, 'hour');
      const yesterdayString = preparedYesterday.toISOString();
      await dispatch(getEodBalanceList({ date: yesterdayString }));
    })();
  }, [dispatch]);

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
    <section className={styles['c-eod-balance']}>
      <CustomModal title={t('eod_balance_summary')} isVisible={isModalVisible} onClose={handleCloseModal}>
        <EditEodBalance
          shouldResetForm={shouldResetForm}
          selectedRowData={selectedRowData}
          onClose={() => {
            handleCloseModal();
          }}
        />
      </CustomModal>
      <PageTitle type='data' svg={<BalanceHubSvg />} title={t('eod_balance_summary')} />
      <div className={styles['c-eod-balance__container']}>
        <Formik innerRef={formikRef} initialValues={EodBalanceInitialValue()} validationSchema={EodBalanceValidationSchema} validateOnChange={true} onSubmit={submitHandler} validateOnBlur={true}>
          {({ values, setFieldValue, handleSubmit, errors }) => (
            <Form name='eod-balance' layout='vertical' onFinish={handleSubmit}>
              <Row align={'middle'} gutter={18}>
                <Col>
                  <Form.Item name='eodDate' label={t('eodDateFilter')}>
                    <DatePicker
                      defaultValue={values?.eodDate}
                      showTime={false}
                      format='DD/MM/YYYY'
                      value={values?.eodDate}
                      disabledDate={(current) => {
                        return current && current > dayjs().endOf('day');
                      }}
                      onChange={(date) => {
                        if (date) {
                          const selectedDate = dayjs(date);
                          const today = dayjs();

                          if (selectedDate.isSame(today, 'day')) {
                            const currentTime = dayjs();
                            setFieldValue('eodDate', currentTime);
                          } else {
                            const selectedDateEndOfDay = selectedDate.endOf('day');
                            setFieldValue('eodDate', selectedDateEndOfDay);
                          }
                        } else {
                          setFieldValue('eodDate', date);
                        }
                      }}
                    />
                    <CErrorMessage errorMessage={errors?.eodDate} />
                  </Form.Item>
                </Col>
                <Col>
                  <Button type='primary' htmlType='submit' text={t('filter')} />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles['c-eod-balance__grid']}>
          <CDataGrid
            gridKey='eodBalanceSummary'
            pTitle='EODBalance'
            data={dataSource}
            columns={eodBalanceSummaryColumns}
            columnFilter={false}
            columnChooserButtonVisible={true}
            stateStore='NO'
            addLogicVisible={false}
            deleteButtonVisible={false}
            refreshVisible={false}
            editButtonVisible={true}
            excelExportVisible={true}
            handleExportExcel={handleExportExcel}
            handleOpenEditModal={handleOpenEditModal}
            height={'70vh'}
            pageSize={1000}
          />
        </div>
      )}
    </section>
  );
}
