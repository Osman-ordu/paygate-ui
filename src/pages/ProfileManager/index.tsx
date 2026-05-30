import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getProfileList } from '../../store/permissions';
import { profileManagerColumns } from '../../db/Columns';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid';
import CustomModal from '../../components/Modal';
import Loader from '../../components/Loader';
import EditProfileForm from './Edit';
import AddProfileForm from './Add';
import ProfileManagement from '../../assets/svg/ProfileManagement.svg?react';
import styles from './styles.module.scss';

const ProfileManager = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const profileList = useAppSelector((state) => state.getProfileListValue?.data?.data);
  const isLoading = useAppSelector((state) => state.getProfileListValue?.isLoading);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    const fetchProfileList = async () => {
      await dispatch(getProfileList());
    };
    fetchProfileList();
  }, []);

  function handleCloseModal() {
    setIsModalVisible(false);
  }

  function handleOpenModal() {
    setShouldResetForm(true);
    setIsModalVisible(true);
  }

  function handleOpenEditModal(rowData: any) {
    setSelectedRowData(rowData);
    setShouldResetForm(true);
    setIsEditModalVisible(true);
  }

  function handleCloseEditModal() {
    setIsEditModalVisible(false);
  }

  return (
    <section className={styles['c-profile-manager']}>
      <CustomModal title={t('add_profile')} isVisible={isModalVisible} onClose={handleCloseModal} width='25%'>
        <AddProfileForm
          shouldResetForm={shouldResetForm}
          onFormReset={() => setShouldResetForm(false)}
          onClose={() => {
            handleCloseModal();
          }}
        />
      </CustomModal>
      <CustomModal title={t('edit_profile')} isVisible={isEditModalVisible} onClose={handleCloseEditModal}>
        <EditProfileForm
          shouldResetForm={shouldResetForm}
          onFormReset={() => setShouldResetForm(false)}
          onClose={() => {
            handleCloseEditModal();
          }}
          selectedRowData={selectedRowData}
        />
      </CustomModal>
      <PageTitle type='data' svg={<ProfileManagement />} title={t('roles')} />
      {isLoading && <Loader />}
      {!isLoading && (
        <CDataGrid
          gridKey={'profileManagerStorage'}
          pTitle='ProfileManager'
          deleteButtonVisible={false}
          addLogicVisible={true}
          data={profileList}
          columns={profileManagerColumns}
          columnFilter={true}
          stateStore='NO'
          handleOpenModal={handleOpenModal}
          handleOpenEditModal={handleOpenEditModal}
        />
      )}
    </section>
  );
};
export default ProfileManager;
