import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getBankData } from '../../store/bank';
import { bankColumns } from '../../db/Columns';
import PageTitle from '../../components/PageTitle';
import Loader from '../../components/Loader';
import CDataGrid from '../../components/CDataGrid';
import PiClockUser from '../../assets/svg/PiClockUser.svg?react';

const Hours = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const bankData = useAppSelector((state) => state.bankValue?.data);
  const isLoading = useAppSelector((state) => state.bankValue?.isLoading);

  useEffect(() => {
    dispatch(getBankData());
  }, []);

  return (
    <section>
      <PageTitle type='data' svg={<PiClockUser />} title={t('working_hours')} />
      {isLoading && <Loader />}
      {!isLoading && (
        <CDataGrid
          gridKey={'hoursStorage'}
          pTitle='WorkingHours'
          addLogicVisible={false}
          data={bankData.data}
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
export default Hours;
