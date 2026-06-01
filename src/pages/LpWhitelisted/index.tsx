import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeStatusLpWhitelist, getLpWhitelist } from '../../store/lpWhitelist';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { lpWhitelistedColumns } from '../../db/Columns';
import PageTitle from '../../components/PageTitle';
import Loader from '../../components/Loader';
import CDataGrid from '../../components/CDataGrid/Lazy';
import CustomModal from '../../components/Modal';
import AddForm from './Add';
import EditForm from './Edit';
import DeleteForm from './Delete';
import ILpWhitelist from '../../assets/svg/LpWhitelist.svg?react';
import styles from './styles.module.scss';

export default function LpWhitelisted() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state?.getLpWhitelistValue?.data?.data) || {};
  const isLoading = false;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  function handleOpenModal() {
    setShouldResetForm(true);
    setIsModalVisible(true);
  }

  function handleOpenEditModal(rowData: any) {
    setShouldResetForm(true);
    setIsEditModalVisible(true);
    setSelectedRowData(rowData);
  }

  function handleCloseEditModal() {
    setIsEditModalVisible(false);
  }

  function handleCloseModal() {
    setIsModalVisible(false);
  }
  const handleOpenDeleteModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsDeleteModalVisible(true);
  };

  function handleCloseDeleteModal() {
    setIsDeleteModalVisible(false);
  }

  const handleStatusChange = async ({ id }: any) => {
    await dispatch(changeStatusLpWhitelist(id));
    await dispatch(getLpWhitelist());
  };

  useEffect(() => {
    dispatch(getLpWhitelist());
  }, []);

  return (
    <section className={styles['c-lp-whitelisted']}>
      <CustomModal title={t('addLpWhitelisted')} isVisible={isModalVisible} onClose={handleCloseModal} width='50%'>
        <AddForm
          shouldResetForm={shouldResetForm}
          onFormReset={() => setShouldResetForm(false)}
          onClose={() => {
            handleCloseModal();
          }}
        />
      </CustomModal>
      <CustomModal title={t('editLpWhitelisted')} isVisible={isEditModalVisible} onClose={handleCloseEditModal}>
        <EditForm selectedRowData={selectedRowData} onClose={handleCloseEditModal} />
      </CustomModal>
      <CustomModal title={t('deleteLpWhitelisted')} isVisible={isDeleteModalVisible} onClose={handleCloseDeleteModal} width='25%'>
        <DeleteForm selectedRowData={selectedRowData} onClose={handleCloseDeleteModal} />
      </CustomModal>
      <PageTitle type='data' svg={<ILpWhitelist />} title={t('lpWhitelisted')} />

      {isLoading && <Loader />}
      {!isLoading && (
        <CDataGrid
          gridKey='lpWhiteListed'
          pTitle='LPWhiteListed'
          addLogicVisible={true}
          data={data}
          columns={lpWhitelistedColumns}
          columnFilter={true}
          columnChooserButtonVisible={true}
          stateStore='NO'
          editButtonVisible={true}
          deleteButtonVisible={true}
          handleOpenModal={handleOpenModal}
          handleOpenEditModal={handleOpenEditModal}
          handleOpenDeleteModal={handleOpenDeleteModal}
          handleStatusChange={handleStatusChange}
        />
      )}
    </section>
  );
}
