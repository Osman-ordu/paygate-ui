import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getUserData } from '../../store/user';
import { userColumns } from '../../db/Columns';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid';
import Loader from '../../components/Loader';
import PiUser from '../../assets/svg/PiUser.svg?react';

const User = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.userValue?.data);
  const isLoading = useAppSelector((state) => state.userValue?.isLoading);

  useEffect(() => {
    dispatch(getUserData());
  }, []);

  return (
    <section>
      <PageTitle type='data' svg={<PiUser />} title={t('user')} />
      {isLoading && <Loader />}
      {!isLoading && (
        <CDataGrid
          gridKey={'userStorage'}
          addLogicVisible={false}
          data={userData.data}
          columns={userColumns}
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
export default User;
