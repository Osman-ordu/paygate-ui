import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getUserData } from '../../store/user';
import { putChangeStatus } from '../../store/userManager';
import { userManagerColumns } from '../../db/Columns';
import { putResetGoogleAuth } from '../../store/auth';
import CDataGrid from '../../components/CDataGrid';
import CustomModal from '../../components/Modal';
import QRCodeModal from '../../components/QRCodeModal';
import PageTitle from '../../components/PageTitle';
import Loader from '../../components/Loader';
import EditUserForm from './Edit';
import AddUserForm from './Add';
import UserManagement from '../../assets/svg/UserManagement.svg?react';
import styles from './styles.module.scss';

export default function UserList() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const userList = useAppSelector((state) => state.userValue?.data?.data);
  const isLoading = useAppSelector((state) => state.userValue?.isLoading);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const handleOpenModal = () => {
    setShouldResetForm(true);
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setShouldResetForm(true);
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
  };

  const handleActive = async (rowData: any) => {
    const { id, isActive } = rowData;
    const changeStatusResponse = await dispatch(putChangeStatus({ id, isActive }));
    const success = changeStatusResponse.payload.success;
    if (success) {
      await dispatch(getUserData());
    }
  };

  const handleResetGoogleAuth = async (rowData: any) => {
    const { id } = rowData;
    const resetGoogleAuthResponse = await dispatch(putResetGoogleAuth({ id }));
    const success = resetGoogleAuthResponse.payload.success;
    if (success) {
      setQrCodeData(resetGoogleAuthResponse.payload.data);
      setIsQRModalVisible(true);
    }
  };

  const getUserManagerColumnsWithRenders = () => {
    return userManagerColumns.map((column) => {
      if (column.dataField === 'status') {
        return {
          ...column,
          cellRender: (cellInfo: any) => <span className={`${styles[`c-user-manager__${cellInfo.value === 1 ? 'success' : 'danger'}`]}`}>{cellInfo.value === 1 ? t('active') : t('passive')}</span>,
        };
      }
      return column;
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      await dispatch(getUserData());
    };
    fetchUserData();
  }, [dispatch]);

  return (
    <section className={styles['c-user-manager']}>
      <CustomModal title={t('add_user')} isVisible={isModalVisible} onClose={handleCloseModal}>
        <AddUserForm shouldResetForm={shouldResetForm} onFormReset={() => setShouldResetForm(false)} onClose={handleCloseModal} />
      </CustomModal>
      <CustomModal title={t('edit_user')} isVisible={isEditModalVisible} onClose={handleCloseEditModal}>
        <EditUserForm shouldResetForm={shouldResetForm} onFormReset={() => setShouldResetForm(false)} selectedRowData={selectedRowData} onClose={handleCloseEditModal} />
      </CustomModal>
      <QRCodeModal isVisible={isQRModalVisible} onClose={() => setIsQRModalVisible(false)} qrCodeData={qrCodeData || ''} />
      <PageTitle type='data' svg={<UserManagement />} title={t('user_manager')} />
      {isLoading && <Loader />}
      {!isLoading && (
        <CDataGrid
          gridKey={'userStorage'}
          pTitle='UserManager'
          addLogicVisible={true}
          deleteButtonVisible={false}
          columnFilter={true}
          resetVisible={true}
          handleReset={handleResetGoogleAuth}
          activeButtonVisible={true}
          data={userList}
          columns={getUserManagerColumnsWithRenders()}
          stateStore='NO'
          handleOpenEditModal={handleOpenEditModal}
          handleOpenModal={handleOpenModal}
          handleActiveButton={handleActive}
        />
      )}
    </section>
  );
}
