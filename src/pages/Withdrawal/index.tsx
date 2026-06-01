import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomStore from 'devextreme/data/custom_store';
import { CallApi } from '../../utils/services';
import { renderCellAmount, renderCellIban } from '../../utils/renderCell';
import { transformFilter, transformSort } from '../../utils/general';
import { getTransactionStatusConfig } from '../../db/Configs';
import { WithdrawalGridCellData } from '../../dbProps';
import { withdrawalColumns } from '../../db/Columns';
import PageTitle from '../../components/PageTitle';
import LogsModal from './LogsModal';
import CDataGrid from '../../components/CDataGrid/Lazy';
import CustomModal from '../../components/Modal';
import PiHandWithdraw from '../../assets/svg/PiHandWitdraw.svg?react';
import styles from './styles.module.scss';

export default function Withdrawal() {
  const { t } = useTranslation();
  const gridRef = useRef<null>(null);
  const dataSource: any = useMemo(
    () =>
      new CustomStore({
        key: 'id',
        load: async (loadOptions: any) => {
          const { data } = await CallApi({
            url: `/api/Withdrawal/getList`,
            method: 'POST',
            data: {
              take: 100,
              page: loadOptions.skip / loadOptions.take,
              filter: loadOptions.filter ? transformFilter(loadOptions.filter) : null,
              sort: loadOptions.sort ? transformSort(loadOptions.sort) : null,
            },
          });
          return {
            data: data.result,
            totalCount: data.totalCount,
          };
        },
      }),
    []
  );
  const [isLogsModalVisible, setIsLogsModalVisible] = useState(false);
  const [transactionNo, setTransactionNo] = useState('');

  const renderCellTransactionStatus = (rowData: WithdrawalGridCellData) => {
    const statusConfig = getTransactionStatusConfig(t).withdrawal[rowData.data.transactionStatus];
    return <span className={styles[statusConfig.className]}>{statusConfig.text}</span>;
  };

  const getWithdrawalColumnsWithRenders = () => {
    return withdrawalColumns.map((column: any) => {
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
      }
      return newColumn;
    });
  };

  const handleExportExcel = async () => {
    const { data } = await CallApi({
      url: `/api/Withdrawal`,
      method: 'GET',
    });
    const { exportToExcel } = await import('../../utils/excel-export');
    exportToExcel('withdrawal', data, 'withdrawal.xlsx', t);
  };

  const handleLogs = (data: any) => {
    setIsLogsModalVisible(true);
    setTransactionNo(data.id);
  };

  return (
    <section className={styles['c-withdrawal']}>
      <CustomModal title={t('log_details')} isVisible={isLogsModalVisible} onClose={() => setIsLogsModalVisible(false)} width='600px'>
        <LogsModal transactionNo={transactionNo} />
      </CustomModal>
      <PageTitle type='data' svg={<PiHandWithdraw />} title={t('withdrawal')} />
      <CDataGrid
        gridKey='withdrawalStorage'
        pTitle='Withdrawal'
        remoteOperations={true}
        addLogicVisible={false}
        data={dataSource}
        loadPanel={true}
        columns={getWithdrawalColumnsWithRenders()}
        columnFilter={true}
        columnChooserButtonVisible={true}
        stateStore='NO'
        editButtonVisible={false}
        deleteButtonVisible={false}
        refreshVisible={false}
        importButtonVisible={false}
        refSource={gridRef}
        excelExportVisible={true}
        handleExportExcel={handleExportExcel}
        renderingMode='virtual'
        scrollingMode='standard'
        logsVisible={true}
        handleLogs={handleLogs}
        paging={true}
        height={'80vh'}
      />
    </section>
  );
}
