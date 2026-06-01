import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getLPAccounts, getLpAccountsWallets } from '../../store/LPAccounts';
import { lpAccountsColumns } from '../../db/Columns';
import { senderLpEnum } from '../../db/Enums';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid';
import CustomModal from '../../components/Modal';
import Loader from '../../components/Loader';
import DetailForm from './detail';
import ILpAccounts from '../../assets/svg/LpAccounts.svg?react';
import styles from './styles.module.scss';

export default function LpAccounts() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state: any) => state.getLPAccountsValue?.isLoading);
  const lpAccounts = useAppSelector((state: any) => state.getLPAccountsValue?.data?.data);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [lpName, setLpName] = useState('');
  const [lpCurrency, setLpCurrency] = useState('');

  const handleExportExcel = async () => {
    const { exportToExcel } = await import('../../utils/excel-export');
    exportToExcel('lpAccounts', lpAccounts, 'lpAccounts.xlsx', t);
  };

  const handleLinkTo = (rowData: any) => {
    const { accountCurrency, lpName } = rowData;
    const lpNameId = senderLpEnum?.find((item: any) => item.label.toLowerCase() === lpName.toLowerCase())?.value;
    if (lpNameId !== undefined && lpNameId !== null) {
      dispatch(getLpAccountsWallets({ lpNameId: lpNameId, accountCurrency: accountCurrency }));
      setLpName(lpName);
      setLpCurrency(accountCurrency);
      setIsDetailModalVisible(true);
    }
  };

  const getLpAccountsColumnsWithRenders = () => {
    return lpAccountsColumns.map((column) => {
      if (column.dataField === 'accountStatus') {
        return {
          ...column,
          cellRender: (cellInfo: any) => <span className={`${styles[`c-lp-accounts__${cellInfo.value === 'Active' ? 'success' : 'danger'}`]}`}>{cellInfo.value}</span>,
        };
      }
      return column;
    });
  };

  useEffect(() => {
    dispatch(getLPAccounts());
  }, [dispatch]);

  return (
    <section className={styles['c-lp-accounts']}>
      <CustomModal isVisible={isDetailModalVisible} onClose={() => setIsDetailModalVisible(false)} width='600px'>
        <DetailForm lpName={lpName} lpCurrency={lpCurrency} />
      </CustomModal>
      <PageTitle type='data' svg={<ILpAccounts />} title={t('lp_accounts')} />
      {isLoading && <Loader />}
      {!isLoading && (
        <CDataGrid
          gridKey='lpAccountStorage'
          pTitle='LpAccounts'
          addLogicVisible={true}
          remoteOperations={true}
          data={lpAccounts}
          columns={getLpAccountsColumnsWithRenders()}
          columnFilter={true}
          stateStore='NO'
          editButtonVisible={true}
          deleteButtonVisible={false}
          refreshVisible={false}
          excelExportVisible={true}
          handleExportExcel={handleExportExcel}
          linkTo={handleLinkTo}
        />
      )}
    </section>
  );
}
