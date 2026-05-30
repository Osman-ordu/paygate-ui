import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomStore from 'devextreme/data/custom_store';
import { useAppDispatch } from '../../store/hooks';
import { putRefund } from '../../store/refund';
import { postReject } from '../../store/reject';
import { confirmMoneyTransfer } from '../../store/transferMoney';
import { changeMasakStatement } from '../../store/masak';
import { exportToExcel } from '../../utils/excel-export';
import { CallApi } from '../../utils/services';
import { renderCellAmount, renderCellIban } from '../../utils/renderCell';
import { getEncryptModuleData, sortDataByDateDeposit, transformFilter, transformSort } from '../../utils/general';
import { getTransactionStatusConfig } from '../../db/Configs';
import { refundCellEnum, ActionType } from '../../db/Enums';
import { depositColumns } from '../../db/Columns';
import { DepositGridCellData, IActionState } from '../../dbProps';
import CDataGrid from '../../components/CDataGrid';
import PageTitle from '../../components/PageTitle';
import CustomModal from '../../components/Modal';
import Button from '../../components/Button';
import LogsModal from './LogsModal';
import StatusUpdateForm from './StatusUpdateForm';
import PiHandDeposit from '../../assets/svg/PiHandDeposit.svg?react';
import styles from './styles.module.scss';

export default function Deposit() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const perData = useMemo(() => getEncryptModuleData(), []);
  const pScore = useMemo(() => {
    return perData?.find((item: any) => item.moduleName === 'TreasuryTransfer')?.permissionScore;
  }, [perData]);
  const editTrue = new Set([4, 6, 8, 10]).has(pScore);
  const gridRef = useRef<null>(null);
  const [forceReload, setForceReload] = useState(0);
  const [isAutoRefreshActive, setIsAutoRefreshActive] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<any>([]);
  const [currentSort, setCurrentSort] = useState<any>([]);
  const [actionStates, setActionStates] = useState<Record<ActionType, IActionState>>({
    [ActionType.REFUND]: { loading: false, triggeredActionIds: [] },
    [ActionType.REJECT]: { loading: false, triggeredActionIds: [] },
    [ActionType.TRANSFER]: { loading: false, triggeredActionIds: [] },
  });
  const [isLogsModalVisible, setIsLogsModalVisible] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [isEditLogsModalVisible, setIsEditLogsModalVisible] = useState(false);

  const dataSource: any = useMemo(
    () =>
      new CustomStore({
        key: 'id',
        load: async (loadOptions: any) => {
          const { data } = await CallApi({
            url: `/api/Deposit/getList`,
            method: 'POST',
            data: {
              take: 100,
              page: loadOptions.skip / loadOptions.take,
              filter: loadOptions.filter ? transformFilter(loadOptions.filter) : null,
              sort: loadOptions.sort ? transformSort(loadOptions.sort) : null,
            },
          });
          setCurrentFilter(loadOptions.filter ? transformFilter(loadOptions.filter) : null);
          setCurrentSort(loadOptions.sort ? transformSort(loadOptions.sort) : null);
          return {
            data: data.result,
            totalCount: data.totalCount,
          };
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [forceReload]
  );

  const updateActionState = (actionType: ActionType, updates: Partial<IActionState>) => {
    setActionStates((prev) => ({
      ...prev,
      [actionType]: {
        ...prev[actionType],
        ...updates,
      },
    }));
  };

  const handleRefund = (id: string) => async () => {
    updateActionState(ActionType.REFUND, { loading: true, triggeredActionIds: [...actionStates[ActionType.REFUND].triggeredActionIds, id] });

    if (!actionStates[ActionType.REFUND].triggeredActionIds.includes(id)) {
      const refundResponse = await dispatch(putRefund({ id }));
      if (refundResponse.payload === undefined) {
        setForceReload((prev) => prev + 1);
        return;
      }
      const { success } = refundResponse.payload;
      if (success === true) {
        updateActionState(ActionType.REFUND, { loading: false });
        setForceReload((prev) => prev + 1);
      }
    }
  };

  const handleReject = (id: string) => async () => {
    updateActionState(ActionType.REJECT, { loading: true, triggeredActionIds: [...actionStates[ActionType.REJECT].triggeredActionIds, id] });
    if (!actionStates[ActionType.REJECT].triggeredActionIds.includes(id)) {
      const rejectResponse = await dispatch(postReject({ id }));
      const { success } = rejectResponse.payload;
      if (success === true) {
        updateActionState(ActionType.REJECT, { loading: false });
        setForceReload((prev) => prev + 1);
      }
    }
  };

  const handleMoneyTransfer = (id: string) => async () => {
    updateActionState(ActionType.TRANSFER, { loading: true, triggeredActionIds: [...actionStates[ActionType.TRANSFER].triggeredActionIds, id] });
    if (!actionStates[ActionType.TRANSFER].triggeredActionIds.includes(id)) {
      const transferResponse = await dispatch(confirmMoneyTransfer({ id }));
      const { success } = transferResponse.payload;
      if (success === true) {
        updateActionState(ActionType.TRANSFER, { loading: false });
        setForceReload((prev) => prev + 1);
      }
    }
  };

  const renderRefundCell = (rowData: any) => {
    const { refund, transactionStatus }: { refund: number; transactionStatus: number } = rowData.data;
    const refundId = rowData.data.id;
    const disableRefund = actionStates[ActionType.REFUND].triggeredActionIds.includes(refundId);
    const isButtonLoading = actionStates[ActionType.REFUND].loading && actionStates[ActionType.REFUND].triggeredActionIds.includes(refundId);

    if (refund === 0) {
      return <span>{t('responseFromBank')}</span>;
    }
    if (refund === 1) {
      return <span>{t('returned')}</span>;
    }
    if (refund === 2) {
      return <span>{t('unreturned')}</span>;
    }
    if ((transactionStatus === 0 || transactionStatus === 7) && refund === null && editTrue) {
      return (
        <div className={rowData.key.transactionStatus === 1 ? `${styles['c-instancebutton']} ${styles['displayNone']}` : `${styles['c-instancebutton']} ${styles['displayBlock']}`}>
          <Button disabled={disableRefund} text={t('refund_money')} handleClick={handleRefund(refundId)} loading={isButtonLoading} />
        </div>
      );
    }
    if (transactionStatus === 4 && refund === null && editTrue) {
      const isRejectLoading = actionStates[ActionType.REJECT].loading && actionStates[ActionType.REJECT].triggeredActionIds.includes(refundId);
      return (
        <div className={rowData.key.transactionStatus === 1 ? `${styles['c-instancebutton']} ${styles['displayNone']}` : `${styles['c-instancebutton']} ${styles['displayBlock']}`}>
          <Button type='danger' disabled={disableRefund} text={t('cancel_money')} handleClick={handleReject(refundId)} loading={isRejectLoading} />
        </div>
      );
    }
    if (transactionStatus === 0 && refund !== null) {
      return <span>{`${refundCellEnum[refund]}`}</span>;
    }
  };

  const renderCellTransactionStatus = (rowData: DepositGridCellData) => {
    const statusConfig = getTransactionStatusConfig(t).deposit[rowData.data.transactionStatus];
    return <span className={styles[statusConfig?.className]}>{statusConfig?.text}</span>;
  };

  const renderSendMoneyCell = (rowData: any) => {
    const { transactionStatus, id, refund } = rowData.data;
    const isTransferLoading = actionStates[ActionType.TRANSFER].loading && actionStates[ActionType.TRANSFER].triggeredActionIds.includes(id);
    if (transactionStatus === 3 || transactionStatus === 4) {
      if (refund === 0 && editTrue) {
        return (
          <div className={`${styles['c-instancebutton']} ${styles['displayBlock']}`}>
            <Button handleClick={handleMoneyTransfer(id)} text={t('transfer_money')} disabled loading={isTransferLoading} type={'disabled'} />
          </div>
        );
      }
      if (refund === 1) {
        return <div className={`${styles['c-instancebutton']} ${styles['displayBlock']}`}></div>;
      }
      if (refund === 2 && editTrue) {
        return (
          <div className={`${styles['c-instancebutton']} ${styles['displayBlock']}`}>
            <Button handleClick={handleMoneyTransfer(id)} text={t('transfer_money')} loading={isTransferLoading} type={'primary'} />
          </div>
        );
      }
      if (refund === null && editTrue) {
        return (
          <div className={`${styles['c-instancebutton']} ${styles['displayBlock']}`}>
            <Button handleClick={handleMoneyTransfer(id)} text={t('transfer_money')} loading={isTransferLoading} type={'primary'} />
          </div>
        );
      }
    }
  };

  const handleCellClick = async (cellData: any) => {
    if (cellData.column.dataField === 'masakReport') {
      await dispatch(changeMasakStatement({ id: cellData.row.data.id }));
    }
  };

  const handleExportExcel = async () => {
    const { data } = await CallApi({
      url: `/api/Deposit/export`,
      method: 'POST',
      data: {
        filter: currentFilter,
        sort: currentSort,
      },
    });
    const sortedDepositData = sortDataByDateDeposit(data);
    exportToExcel('deposit', sortedDepositData, 'deposit.xlsx', t);
  };

  const getDepositColumnsWithRenders = () => {
    return depositColumns.map((column: any) => {
      const newColumn = { ...column };
      switch (column.dataField) {
        case 'iban':
          newColumn.cellRender = renderCellIban;
          break;
        case 'amount':
          newColumn.cellRender = renderCellAmount;
          break;
        case 'transactionStatus':
          newColumn.cellRender = renderCellTransactionStatus;
          break;
        case '':
          newColumn.cellRender = renderSendMoneyCell;
          break;
        case 'refund':
          newColumn.cellRender = renderRefundCell;
          break;
      }
      return newColumn;
    });
  };

  const handleRefresh = () => {
    setForceReload((prev) => prev + 1);
    setIsAutoRefreshActive(true);
  };

  const handleLogs = (data: any) => {
    setIsLogsModalVisible(true);
    setTransactionId(data.id);
  };

  const handleStatusUpdate = (data: any) => {
    setIsEditLogsModalVisible(true);
    setTransactionId(data.id);
  };

  const isEditLogsVisible = (data: any) => {
    const allowedStatuses = [0, 3, 5, 6, 7];
    return allowedStatuses.includes(data.transactionStatus);
  };

  useEffect(() => {
    if (!isAutoRefreshActive) return;
    const interval = setInterval(() => {
      handleRefresh();
    }, 60000);
    return () => clearInterval(interval);
  }, [isAutoRefreshActive]);

  return (
    <section>
      <CustomModal title={t('log_details')} isVisible={isLogsModalVisible} onClose={() => setIsLogsModalVisible(false)} width='600px'>
        <LogsModal transactionId={transactionId} />
      </CustomModal>
      <CustomModal title={t('update_status')} isVisible={isEditLogsModalVisible} onClose={() => setIsEditLogsModalVisible(false)} width='600px'>
        <StatusUpdateForm depositId={transactionId} onClose={() => setIsEditLogsModalVisible(false)} onSuccess={() => setForceReload((prev) => prev + 1)} />
      </CustomModal>
      <PageTitle type='data' svg={<PiHandDeposit />} title={t('deposit')} />
      <CDataGrid
        gridKey='depositStorage'
        pTitle='Deposit'
        remoteOperations={true}
        onCellClick={handleCellClick}
        addLogicVisible={false}
        columnChooserButtonVisible={true}
        data={dataSource}
        loadPanel={true}
        columns={getDepositColumnsWithRenders()}
        columnFilter={true}
        stateStore='NO'
        editButtonVisible={false}
        deleteButtonVisible={false}
        refreshVisible={true}
        handleRefresh={handleRefresh}
        refSource={gridRef}
        excelExportVisible={true}
        handleExportExcel={handleExportExcel}
        renderingMode='virtual'
        scrollingMode='standard'
        logsVisible={true}
        handleLogs={handleLogs}
        editLogsVisible={isEditLogsVisible}
        handleEditLogs={handleStatusUpdate}
        paging={true}
        height={'81vh'}
      />
    </section>
  );
}
