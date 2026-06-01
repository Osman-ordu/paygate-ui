import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getBankAccountDetail } from '../../store/bankAccountDetail';
import { balanceColumns } from '../../db/Columns';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid/Lazy';
import Loader from '../../components/Loader';
import PiWallet from '../../assets/svg/PiWallet.svg?react';
import styles from './styles.module.scss';

const Balance = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>(null);
  const bankAccountDetailData = useAppSelector((state) => state.getBankAccountDetailValue?.data?.data);
  const isLoading = useAppSelector((state) => state.getBankAccountDetailValue?.isLoading);

  const formattedData = useMemo(() => {
    return (
      bankAccountDetailData?.map((item: any) => ({
        currency: item.symbol,
        balance: item.balance,
        availableBalance: item.availableBalance,
        name: item.accountName || 'N/A',
        companyBankName: item.companyBankName,
        priority: item.priority,
      })) || []
    );
  }, [bankAccountDetailData]);

  const moveTotalFooter = () => {
    const gridElement = gridRef.current?.instance?.element?.();
    if (!gridElement) return;

    const rowsView = gridElement.querySelector('.dx-datagrid-rowsview');
    const totalFooter = gridElement.querySelector('.dx-datagrid-total-footer');

    if (rowsView && totalFooter) {
      const parent = rowsView.parentNode;
      if (parent) {
        totalFooter.remove();
        parent.insertBefore(totalFooter, rowsView);
      }
    }
  };

  useEffect(() => {
    dispatch(getBankAccountDetail());
  }, [dispatch]);

  useEffect(() => {
    const gridElement = gridRef.current?.instance?.element?.();
    if (!gridElement) return;

    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.type === 'childList')) {
        moveTotalFooter();
      }
    });

    observer.observe(gridElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles['c-balance']}>
      <PageTitle type='data' svg={<PiWallet />} title={t('instant_balance')} />
      {isLoading && <Loader />}
      {!isLoading && (
        <CDataGrid
          gridKey={'balanceStorage'}
          pTitle='InstanyBalance'
          addLogicVisible={false}
          data={formattedData}
          columns={balanceColumns}
          columnFilter={true}
          stateStore='NO'
          editButtonVisible={false}
          deleteButtonVisible={false}
          refreshVisible={false}
          refSource={gridRef}
          onRowPrepared={(e) => {
            if (e.rowType === 'totalFooter') {
              moveTotalFooter();
            }
          }}
          summary={{
            totalItems: [
              { column: 'companyBankName', displayFormat: 'TOTAL' },
              { column: 'balance', summaryType: 'sum', displayFormat: '{0}', valueFormat: '#,##0.##;($ #,##0.##)' },
              { column: 'availableBalance', summaryType: 'sum', displayFormat: '{0}', valueFormat: '#,##0.##;($ #,##0.##)' },
            ],
          }}
        />
      )}
    </section>
  );
};

export default Balance;
