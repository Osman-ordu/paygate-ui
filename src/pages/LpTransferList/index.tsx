import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, DatePicker, Select } from 'antd';
import { toast } from 'react-toastify';
import { Formik, FormikProps } from 'formik';
import dayjs from 'dayjs';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getLPTransferList } from '../../store/LPTransferlist';
import { transferTimeEnum } from '../../db/Enums';
import { lpTransferListColumns } from '../../db/Columns';
import { LpTransferListValidationSchema, LpTransferListInitialValue } from './Validation';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import ILpTransferlist from '../../assets/svg/LpTransferlist.svg?react';
import styles from './styles.module.scss';

export default function LpTransferList({ onFormReset, shouldResetForm }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.getLPTransferListValue?.isLoading);
  const data = useAppSelector((state) => state.getLPTransferListValue?.data?.data);
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
    try {
      const filteredData = dataSource.items();
      const { exportToExcel } = await import('../../utils/excel-export');
      exportToExcel('lpTransferList', filteredData, 'lpTransferList.xlsx', t);
    } catch (error) {
      toast.error(t('exportError'));
    }
  };

  const submitHandler = async ({ date, startDate, endDate }: any) => {
    if (date === 1) {
      dispatch(getLPTransferList({ startTime: startDate, endTime: endDate }));
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
      endDateVal = dayjs(endDate).add(1, 'day');

      if (startDateVal.isAfter(endDateVal)) {
        toast.error(t('isAfterStartMessage'));
        return;
      }
    }

    dispatch(
      getLPTransferList({
        startTime: startDateVal.toISOString(),
        endTime: endDateVal.toISOString(),
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
    const endTime = dayjs().endOf('day').toISOString();
    const startTime = dayjs().subtract(2, 'day').startOf('day').toISOString();

    dispatch(getLPTransferList({ startTime, endTime }));
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
    <section className={styles['c-lp-transfer-list']}>
      <PageTitle type='normal' svg={<ILpTransferlist />} title={t('lp_transfer_list')} />
      <Formik
        innerRef={formikRef}
        initialValues={LpTransferListInitialValue()}
        validationSchema={LpTransferListValidationSchema}
        validateOnChange={true}
        onSubmit={submitHandler}
        validateOnBlur={true}>
        {({ values, setFieldValue, handleSubmit }) => (
          <Form name='lp-transfer-list' layout='vertical' onFinish={handleSubmit}>
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
        <CDataGrid
          gridKey={'consensusStorage'}
          pTitle='LpTransferList'
          data={dataSource}
          columns={lpTransferListColumns}
          columnFilter={true}
          columnChooserButtonVisible={true}
          stateStore='NO'
          addLogicVisible={true}
          editButtonVisible={false}
          deleteButtonVisible={false}
          refreshVisible={false}
          height={'71vh'}
          excelExportVisible={true}
          handleExportExcel={handleExportExcel}
          pageSize={1000}
        />
      )}
    </section>
  );
}
