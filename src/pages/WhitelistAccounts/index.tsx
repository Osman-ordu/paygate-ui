import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeStatusWhiteListAccounts, getWhiteListAccounts } from '../../store/whitelistAccounts';
import { whitelistAccountColumns } from '../../db/Columns';
import CDataGrid from '../../components/CDataGrid';
import CustomModal from '../../components/Modal';
import PageTitle from '../../components/PageTitle';
import AddForm from './Add';
import EditForm from './Edit';
import DeleteForm from './Delete';
import PiFilePlus from '../../assets/svg/PiFilePlus.svg?react';

export default function WhitelistAccounts() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state?.getWhiteListAccountsValue?.data?.data) || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

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

  const handleOpenDeleteModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsDeleteModalVisible(true);
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const handleEnable = async ({ id }: any) => {
    await dispatch(changeStatusWhiteListAccounts(id));
    await dispatch(getWhiteListAccounts());
  };

  useEffect(() => {
    dispatch(getWhiteListAccounts());
  }, [dispatch]);

  return (
    <section>
      <CustomModal title={t('addForm')} isVisible={isModalVisible} onClose={handleCloseModal}>
        <AddForm
          shouldResetForm={shouldResetForm}
          onFormReset={() => setShouldResetForm(false)}
          onClose={() => {
            handleCloseModal();
          }}
        />
      </CustomModal>
      <CustomModal title={t('editForm')} isVisible={isEditModalVisible} onClose={handleCloseEditModal}>
        <EditForm
          shouldResetForm={shouldResetForm}
          onFormReset={() => setShouldResetForm(false)}
          onClose={() => {
            handleCloseEditModal();
          }}
          selectedRowData={selectedRowData}
        />
      </CustomModal>
      <CustomModal title={t('deleteForm')} isVisible={isDeleteModalVisible} onClose={handleCloseDeleteModal} width='25%'>
        <DeleteForm selectedRowData={selectedRowData} onClose={handleCloseDeleteModal} />
      </CustomModal>
      <PageTitle type='data' svg={<PiFilePlus />} title={t('whitelistAccounts')} />
      <CDataGrid
        gridKey={'sessionsStorage'}
        pTitle='Whitelist'
        addLogicVisible={true}
        data={data}
        columns={whitelistAccountColumns}
        columnFilter={true}
        handleOpenModal={handleOpenModal}
        handleOpenEditModal={handleOpenEditModal}
        handleOpenDeleteModal={handleOpenDeleteModal}
        handleEnable={handleEnable}
      />
    </section>
  );
}
