import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getIntegration } from '../../store/integration';
import { banksColumns, exchangeColumns, lpsColumns } from '../../db/Columns';
import { IntegrationTypeEnum } from '../../db/Enums';
import PageTitle from '../../components/PageTitle';
import CDataGrid from '../../components/CDataGrid/Lazy';
import CustomModal from '../../components/Modal';
import TabButton from '../../components/TabButton';
import Loader from '../../components/Loader';
import IntegrationEdit from './Edit';
import PiBank from '../../assets/svg/PiBank.svg?react';
import style from './styles.module.scss';

const Integration = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('BANKS');
  const [credentialColumns, setCredentialColumns] = useState<any[]>(banksColumns);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state?.integrationValue?.isLoading);
  const integrationData = useAppSelector((state) => state?.getIntegrationValue?.data);

  function handleOpenModal(rowData: any) {
    setShouldResetForm(true);
    setIsModalVisible(true);
    setSelectedRowData(rowData);
  }

  function handleCloseModal() {
    setIsModalVisible(false);
  }

  const handleRefresh = () => {
    dispatch(getIntegration('BANKS'));
  };

  const handleTabClick = async (tab: any) => {
    setSelectedTab(tab);
    switch (tab) {
      case 'BANKS':
        setCredentialColumns(banksColumns);
        await dispatch(getIntegration(tab));
        break;
      case 'LPS':
        setCredentialColumns(lpsColumns);
        await dispatch(getIntegration(tab));
        break;
      case 'EXCHANGE':
        setCredentialColumns(exchangeColumns);
        await dispatch(getIntegration(tab));
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(getIntegration('BANKS')); // default tab
  }, [dispatch]);

  return (
    <section className={style['c-integration']}>
      <PageTitle type='data' svg={<PiBank />} title={t('integrations')} />
      <div className={style['c-integration__tabContainer']}>
        {Object.values(IntegrationTypeEnum)?.map((tab: any) => {
          return <TabButton key={tab} title={tab} status={selectedTab === tab ? 'active' : 'default'} handleClick={() => handleTabClick(tab)} />;
        })}
      </div>
      {isLoading && <Loader />}
      {!isLoading && (
        <CDataGrid
          gridKey={'integrationStorage'}
          pTitle='Integration'
          addLogicVisible={false}
          data={integrationData?.data}
          columns={credentialColumns}
          columnFilter={true}
          stateStore='NO'
          editButtonVisible={true}
          deleteButtonVisible={false}
          handleOpenEditModal={handleOpenModal}
          handleRefresh={handleRefresh}
        />
      )}
      <CustomModal
        title={`'${selectedRowData?.type === 'BinanceTrSettings' ? 'BinanceGlobal' : selectedRowData?.type}' ${t('update_credentials')}`}
        isVisible={isModalVisible}
        onClose={handleCloseModal}>
        <IntegrationEdit
          shouldResetForm={shouldResetForm}
          onFormReset={() => setShouldResetForm(false)}
          onClose={() => {
            handleCloseModal();
          }}
          selectedRowData={selectedRowData}
          integrationType={selectedTab as 'BANKS' | 'EXCHANGE' | 'LPS'}
        />
      </CustomModal>
    </section>
  );
};

export default Integration;
