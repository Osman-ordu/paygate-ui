import { useEffect, useRef, useState } from 'react';
import { Col, Form, Row, DatePicker, Select } from 'antd';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import dayjs from 'dayjs';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getTransferList } from '../../store/transferList';
import { formatterAmount } from '../../utils/general';
import { stTransferStatusEnum, transferTimeEnum, ttTransferStatusEnum } from '../../db/Enums';
import { transferListColumns } from '../../db/Columns';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid/Lazy';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import CustomModal from '../../components/Modal';
import DetailForm from './Detail';
import { ConsensusInitialValue, ConsensusValidationSchema } from './Validation';
import AddForm from './Add';
import PiTransferList from '../../assets/svg/PiTransferList.svg?react';

export default function TransferList({ onFormReset, shouldResetForm }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.getTransferListValue?.isLoading);
  const data = useAppSelector((state) => state.getTransferListValue?.data?.data);
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
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addShouldResetForm, setAddShouldResetForm] = useState(false);

  const submitHandler = async ({ date, startDate, endDate }: any) => {
    if (date === 1) {
      dispatch(getTransferList('allDate'));
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
      getTransferList({
        startDate: startDateVal.toISOString(),
        endDate: endDateVal.toISOString(),
      })
    );
  };

  const linkTo = (rowData: any) => {
    const formattedRowData = {
      ...rowData,
      ttAmount: formatterAmount(rowData.ttAmount),
    };
    setSelectedRowData(formattedRowData);
    setIsDetailModalVisible(true);
  };

  const handleExportExcel = async () => {
    try {
      const filteredData = dataSource.items();
      const { exportToExcel } = await import('../../utils/excel-export');
      exportToExcel('transferList', filteredData, 'transferList.xlsx', t);
    } catch (error) {
      toast.error(t('exportError'));
    }
  };

  const getTransferlistColumnsWithRenders = () => {
    return transferListColumns?.map((column: any) => {
      const newColumn = { ...column };
      switch (column.dataField) {
        case 'stAmount':
          newColumn.cellRender = (rowData: any) => {
            return rowData.data.stAmount ? formatterAmount(rowData.data.stAmount) : '';
          };
          break;
      }
      return newColumn;
    });
  };

  const handleOpenModal = () => {
    setAddShouldResetForm(true);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  useEffect(() => {
    dispatch(getTransferList({}));
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(data)) {
      arrStore.clear();
      arrStore.push(
        data?.map((item: any) => ({
          type: 'insert',
          data: {
            ...item,
            stTransferStatus: stTransferStatusEnum[item.stTransferStatus],
            ttStatus: ttTransferStatusEnum[item.ttStatus],
          },
        }))
      );
      dataSource.reload();
    }
  }, [data, arrStore, dataSource]);

  return (
    <section>
      <CustomModal title={t('detailForm')} isVisible={isDetailModalVisible} onClose={() => setIsDetailModalVisible(false)}>
        <DetailForm selectedRowData={selectedRowData} onClose={() => setIsDetailModalVisible(false)} />
      </CustomModal>
      <PageTitle type='normal' svg={<PiTransferList />} title={t('transferList')} />
      <CustomModal title={t('addManualCompletedTransfer')} isVisible={isModalVisible} onClose={handleCloseModal}>
        <AddForm shouldResetForm={addShouldResetForm} onFormReset={() => setAddShouldResetForm(false)} onClose={handleCloseModal} />
      </CustomModal>
      <Formik innerRef={formikRef} initialValues={ConsensusInitialValue()} validationSchema={ConsensusValidationSchema} validateOnChange={true} onSubmit={submitHandler} validateOnBlur={true}>
        {({ values, setFieldValue, handleSubmit }) => (
          <Form name='consensus' layout='vertical' onFinish={handleSubmit}>
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
          pTitle='TransferList'
          data={dataSource}
          columns={getTransferlistColumnsWithRenders()}
          columnFilter={true}
          columnChooserButtonVisible={true}
          stateStore='NO'
          addLogicVisible={true}
          editButtonVisible={false}
          deleteButtonVisible={false}
          refreshVisible={false}
          height={'71vh'}
          linkTo={linkTo}
          excelExportVisible={true}
          handleExportExcel={handleExportExcel}
          handleOpenModal={handleOpenModal}
          pageSize={1000}
        />
      )}
    </section>
  );
}
