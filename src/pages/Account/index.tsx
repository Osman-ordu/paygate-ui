import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getBankAccount } from '../../store/bankAccount';
import { accountColumns } from '../../db/Columns';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid/Lazy';
import CustomModal from '../../components/Modal';
import Loader from '../../components/Loader';
import AddAccount from './Add';
import EditAccountsForm from './Edit';
import PiFilePlus from '../../assets/svg/PiFilePlus.svg?react';

const Account = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const bankAccountData = useAppSelector((state) => state.bankAccountValue?.data);
  const isLoading = useAppSelector((state) => state.bankAccountValue?.isLoading);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [gridData, setGridData] = useState([]);

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

  useEffect(() => {
    dispatch(getBankAccount());
  }, [dispatch]);

  useEffect(() => {
    if (bankAccountData) {
      const mappedData = bankAccountData?.data?.map((account: any) => ({
        ...account,
        currency: 'TL',
        status: account.status === 0 ? 'Inactive' : 'Active',
      }));
      setGridData(mappedData);
    }
  }, [bankAccountData]);
  return (
    <section>
      <PageTitle type='data' svg={<PiFilePlus />} title={t('add_account')} />
      <CustomModal title={t('add_account')} isVisible={isModalVisible} onClose={handleCloseModal}>
        <AddAccount shouldResetForm={shouldResetForm} onFormReset={() => setShouldResetForm(false)} onClose={handleCloseModal} />
      </CustomModal>
      <CustomModal title={t('edit_account')} isVisible={isEditModalVisible} onClose={handleCloseEditModal}>
        <EditAccountsForm shouldResetForm={shouldResetForm} onFormReset={() => setShouldResetForm(false)} onClose={handleCloseEditModal} selectedRowData={selectedRowData} />
      </CustomModal>
      {isLoading && <Loader />}
      {!isLoading && (
        <CDataGrid
          gridKey={'accountStorage'}
          pTitle='AddAccount'
          addLogicVisible={true}
          data={gridData}
          columns={accountColumns}
          columnFilter={true}
          stateStore='NO'
          editButtonVisible={true}
          deleteButtonVisible={false}
          refreshVisible={false}
          handleOpenModal={handleOpenModal}
          handleOpenEditModal={handleOpenEditModal}
        />
      )}
    </section>
  );
};

export default Account;
