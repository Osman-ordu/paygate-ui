import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeStatusAutoTransferBalance, getAutoTransferBalance, getTransactionLogs } from '../../store/autoTransferBalance';
import { autoTransferBalanceColumns, transactionLogsColumns } from '../../db/Columns';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid';
import CustomModal from '../../components/Modal';
import DeleteForm from './Delete';
import AddForm from './Add';
import EditForm from './Edit';
import TransactionLogs from '../../assets/svg/TransactionLogs.svg?react';
import AutoTransfer from '../../assets/svg/AutoTransferBalance.svg?react';
import styles from './styles.module.scss';

export default function AutoTransferBalance() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const autoTransferBalance = useAppSelector((state: any) => state?.getAutoTransferBalanceValue?.data?.data);
  const transactionLogs = useAppSelector((state: any) => state?.getTransactionLogsValue?.data?.data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleOpenModal = () => {
    setShouldResetForm(true);
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setShouldResetForm(true);
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
  };

  const handleOpenDeleteModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const handleExcelExport = async () => {
    const { exportToExcel } = await import('../../utils/excel-export');
    exportToExcel('AutoTransfer', transactionLogs, 'transactionLogs.xlsx', t);
  };

  const handleEnable = async ({ id }: any) => {
    await dispatch(changeStatusAutoTransferBalance(id));
    await dispatch(getAutoTransferBalance());
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return t('waitingBankResponse');
      case 1:
        return t('completed');
      case 2:
        return t('declined');
      case 3:
        return t('pending');
      default:
        return '-';
    }
  };

  const transactionLogsColumnsWithRenders = () => {
    return transactionLogsColumns?.map((column) => {
      if (column.dataField === 'status') {
        return {
          ...column,
          cellRender: (cellInfo: any) => {
            return <div className={`${styles[`c-auto-transfer-balance__status`]}`}>{getStatusText(cellInfo?.value)}</div>;
          },
        };
      }
      return column;
    });
  };

  useEffect(() => {
    const fetchApis = async () => {
      await dispatch(getAutoTransferBalance());
      await dispatch(getTransactionLogs());
    };
    fetchApis();
  }, []);

  return (
    <>
      <section className={styles['c-auto-transfer-balance']}>
        <CustomModal title={t('add_auto_transfer_rule')} isVisible={isModalVisible} onClose={handleCloseModal}>
          <AddForm
            shouldResetForm={shouldResetForm}
            onFormReset={() => setShouldResetForm(false)}
            onClose={() => {
              handleCloseModal();
            }}
          />
        </CustomModal>
        <CustomModal title={t('edit_auto_transfer_rule')} isVisible={isEditModalVisible} onClose={handleCloseEditModal}>
          <EditForm
            shouldResetForm={shouldResetForm}
            onFormReset={() => setShouldResetForm(false)}
            onClose={() => {
              handleCloseEditModal();
            }}
            selectedRowData={selectedRowData}
          />
        </CustomModal>
        <CustomModal title={t('delete_auto_transfer_rule')} isVisible={isDeleteModalVisible} onClose={handleCloseDeleteModal} width='25%'>
          <DeleteForm selectedRowData={selectedRowData} onClose={handleCloseDeleteModal} />
        </CustomModal>
        <PageTitle svg={<AutoTransfer />} title={t('auto_transfer_balance')} />
        <CDataGrid
          pTitle='AutoTransfer'
          addLogicVisible={true}
          data={autoTransferBalance}
          columns={autoTransferBalanceColumns}
          columnFilter={true}
          stateStore='NO'
          editButtonVisible={true}
          deleteButtonVisible={true}
          refreshVisible={false}
          handleOpenModal={handleOpenModal}
          handleOpenEditModal={handleOpenEditModal}
          handleOpenDeleteModal={handleOpenDeleteModal}
          handleEnable={handleEnable}
          height={'38vh'}
        />
      </section>
      <section className={styles['c-transaction-logs']}>
        <PageTitle svg={<TransactionLogs />} title={t('transaction_logs')} />
        <CDataGrid
          pTitle='AutoTransfer'
          data={transactionLogs}
          columns={transactionLogsColumnsWithRenders()}
          columnFilter={true}
          stateStore='NO'
          addLogicVisible={false}
          editButtonVisible={false}
          deleteButtonVisible={false}
          refreshVisible={false}
          excelExportVisible={true}
          handleExportExcel={handleExcelExport}
          height={'38vh'}
        />
      </section>
    </>
  );
}
