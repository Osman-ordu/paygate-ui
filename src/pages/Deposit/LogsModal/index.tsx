import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getDepositLog } from '../../../store/deposit';
import Loader from '../../../components/Loader';
import CDataGrid from '../../../components/CDataGrid/Lazy';
import PageTitle from '../../../components/PageTitle';
import { logDetailsColumns } from '../../../db/Columns';
import styles from '../styles.module.scss';

export default function LogsModal({ transactionId }: { transactionId: string }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const depositLogData = useAppSelector((state: any) => state.getDepositLogValue?.data?.data);
  const isLoading = useAppSelector((state: any) => state.getDepositLogValue?.isLoading);

  useEffect(() => {
    dispatch(getDepositLog(transactionId));
  }, [transactionId, dispatch]);

  return (
    <>
      <div className={styles['c-logs-modal']}>
        <PageTitle type='data' title={`${t('logs_of_transaction_no')} ${depositLogData?.[0]?.transactionNo || '-'}`} />
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <CDataGrid
          gridKey={'depositLogs'}
          data={depositLogData || []}
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
