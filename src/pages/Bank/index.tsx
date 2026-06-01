import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getBankData } from '../../store/bank';
import { bankColumns } from '../../db/Columns';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid/Lazy';
import Loader from '../../components/Loader';
import PiBank from '../../assets/svg/PiBank.svg?react';

const Bank = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const bankData = useAppSelector((state) => state.withdrawalValue?.data);
  const isLoading = useAppSelector((state) => state.withdrawalValue?.isLoading);

  useEffect(() => {
    dispatch(getBankData());
  }, []);

  return (
    <section>
      <PageTitle type='data' svg={<PiBank />} title={t('banks')} />
      {isLoading && <Loader />}
      {!isLoading && (
        <CDataGrid
          gridKey={'bankStorage'}
          addLogicVisible={false}
          data={bankData?.data}
          columns={bankColumns}
          columnFilter={true}
          stateStore='NO'
          editButtonVisible={false}
          deleteButtonVisible={false}
          refreshVisible={false}
        />
      )}
    </section>
  );
};
export default Bank;
