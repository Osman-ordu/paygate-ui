import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../store/hooks';
import { lpAccountsWalletsColumns } from '../../../db/Columns';
import Loader from '../../../components/Loader';
import CDataGrid from '../../../components/CDataGrid';
import PageTitle from '../../../components/PageTitle';
import ILpAccounts from '../../../assets/svg/LpAccounts.svg?react';
export default function DetailForm({ lpName, lpCurrency }: { lpName: string; lpCurrency: string }) {
  const { t } = useTranslation();
  const lpAccountsWallets = useAppSelector((state: any) => state.getLpAccountsWalletsValue?.data?.data);
  const isLoading = useAppSelector((state: any) => state.getLpAccountsWalletsValue?.isLoading);

  return (
    <>
      <PageTitle type='data' svg={<ILpAccounts />} title={`${lpName} ${lpCurrency} ${t('lpAccountsDetail')}`} />
      {isLoading ? (
        <Loader />
      ) : (
        <CDataGrid
          gridKey={'lpAccountsWallets'}
          data={lpAccountsWallets}
          columns={lpAccountsWalletsColumns}
          columnFilter={true}
          editButtonVisible={false}
          deleteButtonVisible={false}
          addLogicVisible={false}
          refreshVisible={false}
          autoSizeVisible={false}
          height='500'
          scrollingMode='virtual'
        />
      )}
    </>
  );
}
