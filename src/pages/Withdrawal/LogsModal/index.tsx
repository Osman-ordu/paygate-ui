import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import Loader from '../../../components/Loader';
import CDataGrid from '../../../components/CDataGrid';
import PageTitle from '../../../components/PageTitle';
import { logDetailsColumns } from '../../../db/Columns';
import styles from '../styles.module.scss';
import { getWithdrawalLog } from '../../../store/withdrawal';

export default function LogsModal({ transactionNo }: { transactionNo: string }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const withdrawalLogData = useAppSelector((state: any) => state.getWithdrawalLogValue?.data?.data);
  const isLoading = useAppSelector((state: any) => state.getWithdrawalLogValue?.isLoading);

  useEffect(() => {
    dispatch(getWithdrawalLog(transactionNo));
  }, [transactionNo, dispatch]);

  return (
    <>
      <div className={styles['c-logs-modal']}>
        <PageTitle type='data' title={`${t('logs_of_transaction_no')} ${withdrawalLogData?.[0]?.transactionNo || '-'}`} />
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <CDataGrid
          gridKey={'withdrawalLogs'}
          data={withdrawalLogData || []}
          columns={logDetailsColumns}
          columnFilter={false}
          editButtonVisible={false}
          deleteButtonVisible={false}
          addLogicVisible={false}
          refreshVisible={false}
          autoSizeVisible={false}
          height='330'
          scrollingMode='virtual'
          toolbarVisible={false}
        />
      )}
    </>
  );
}
