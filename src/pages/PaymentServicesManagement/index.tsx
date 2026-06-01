import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getPaymentServiceManagement } from '../../store/paymentServiceManagement';
import { customTitleText } from '../../utils/general';
import { serviceManagementColumns } from '../../db/Columns';
import CDataGrid from '../../components/CDataGrid/Lazy';
import PageTitle from '../../components/PageTitle';
import CustomModal from '../../components/Modal';
import Loader from '../../components/Loader';
import EditWorkFrequencyModal from './Edit';
import StatusUpdateModal from './UpdateStatus';
import PaymentServiceManagementSvg from '../../assets/svg/PaymentServiceManagement.svg?react';
import styles from './styles.module.scss';

export default function PaymentServicesManagement() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const language = i18n?.language;
  const paymentServiceManagementData = useAppSelector((state) => state.getPaymentServiceManagementValue?.data?.data);
  const isLoading = useAppSelector((state) => state.getPaymentServiceManagementValue?.isLoading);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [selectedRowData, setSelectedRowData] = useState<any>(null);

  const handleCloseStatusModal = () => {
    setIsStatusModalVisible(false);
  };

  const handleOpenEditModal = (rowData: any) => {
    if (rowData.workFrequency !== null && rowData.workFrequency !== undefined) {
      setShouldResetForm(true);
      setIsEditModalVisible(true);
      setSelectedRowData(rowData);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
  };

  const handleEnable = async (rowData: any) => {
    setSelectedRowData(rowData);
    setIsStatusModalVisible(true);
  };

  useEffect(() => {
    dispatch(getPaymentServiceManagement());
  }, [dispatch]);

  useEffect(() => {
    if (selectedRowData) {
      const serviceName = selectedRowData?.serviceName;
      const status = selectedRowData?.status;
      const title = customTitleText(language, serviceName, status);
      setCustomTitle(title || '');
    }
  }, [selectedRowData, language]);

  return (
    <section className={styles['c-payment-services-management']}>
      <CustomModal title={customTitle} isVisible={isStatusModalVisible} onClose={handleCloseStatusModal} width='32%'>
        <StatusUpdateModal selectedRowData={selectedRowData} onClose={handleCloseStatusModal} />
      </CustomModal>
      <CustomModal title={t('editPaymentServicesManagement')} isVisible={isEditModalVisible} onClose={handleCloseEditModal} width='40%'>
        <EditWorkFrequencyModal selectedRowData={selectedRowData} onClose={handleCloseEditModal} onFormReset={() => setShouldResetForm(false)} shouldResetForm={shouldResetForm} />
      </CustomModal>
      <PageTitle type='normal' svg={<PaymentServiceManagementSvg />} title={t('paymentServicesManagement')} />
      {isLoading ? (
        <Loader />
      ) : (
        <CDataGrid
          pTitle='PaymentServiceManagement'
          addLogicVisible={false}
          data={paymentServiceManagementData}
          columns={serviceManagementColumns}
          columnFilter={false}
          stateStore='NO'
          editButtonVisible={(rowData: any) => rowData.workFrequency !== null && rowData.workFrequency !== undefined}
          deleteButtonVisible={false}
          refreshVisible={false}
          handleEnable={handleEnable}
          handleOpenEditModal={handleOpenEditModal}
          toolbarVisible={false}
          height='74vh'
        />
      )}
    </section>
  );
}
