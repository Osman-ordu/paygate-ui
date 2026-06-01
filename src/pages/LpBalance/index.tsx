import { useEffect, useMemo, useRef } from 'react';
import TreeList, { Column } from 'devextreme-react/tree-list';
import { useTranslation } from 'react-i18next';
import { getLpBalanceList } from '../../store/LPBalance';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import PageTitle from '../../components/PageTitle';
import ButtonIcon from '../../components/ButtonIcon';
import ExcelExportIcon from '../../assets/svg/ExcelExportIcon.svg?react';
import ILpBalance from '../../assets/svg/LpBalance.svg?react';
import styles from './styles.module.scss';

const LpBalance = () => {
  const { t } = useTranslation();
  const treeListRef = useRef<any>(null);
  const dispatch = useAppDispatch();

  const lpBalanceListData = useAppSelector((state: any) => state.getLpBalanceListValue?.data?.data?.balances);
  const totalBalanceData = useAppSelector((state: any) => state.getLpBalanceListValue?.data?.data?.totalBalance);

  const createNode = (id: string, parentId: string | null, name: string, type: string, level: number, data: any) => ({
    id,
    parentId,
    name,
    type,
    currency: data.currency || '',
    quantity: data.quantity || '',
    balance: data.balance || '',
    available: data.available || '',
    level,
  });

  const processedData = useMemo(() => {
    const data = lpBalanceListData;
    const totalBalance = totalBalanceData;

    const totalNode =
      totalBalance &&
      createNode('total', null, '', 'total', -1, {
        balance: totalBalance.balance,
        available: totalBalance.availableBalance,
      });

    const lpNodes =
      data?.map((lp: any) =>
        createNode(`lp_${lp.lpName}`, null, lp.lpName, 'lp', 0, {
          balance: lp.totalBalance,
          available: lp.availableBalance,
        })
      ) || [];

    const accountAndCoinNodes =
      data?.flatMap((lp: any) =>
        lp.data.flatMap((subAccountData: any) => {
          // CoinTr LP'si için main seviyesini atla, direkt coinleri listele
          if (lp.lpName === 'CoinTr') {
            const coinNodes = subAccountData.coins?.map((coin: any, index: number) =>
              createNode(`coin_${lp.lpName}_${subAccountData.accountName}_${coin.currency}_${index}`, `lp_${lp.lpName}`, coin.currency, 'coin', 1, {
                currency: coin.currency,
                quantity: coin.quantity,
                balance: coin.balance,
                available: coin.available,
              })
            );
            return coinNodes;
          }

          // Diğer LP'ler için normal yapıdan devam et
          const accountNode = createNode(`account_${lp.lpName}_${subAccountData.accountName}`, `lp_${lp.lpName}`, subAccountData.accountName, 'account', 1, {
            currency: subAccountData.accountName,
            balance: subAccountData.subBalance,
            available: subAccountData.subAvailable,
          });

          const coinNodes = subAccountData.coins?.map((coin: any, index: number) =>
            createNode(`coin_${lp.lpName}_${subAccountData.accountName}_${coin.currency}_${index}`, `account_${lp.lpName}_${subAccountData.accountName}`, coin.currency, 'coin', 2, {
              currency: coin.currency,
              quantity: coin.quantity,
              balance: coin.balance,
              available: coin.available,
            })
          );

          return [accountNode, ...coinNodes];
        })
      ) || [];

    return [totalNode, ...lpNodes, ...accountAndCoinNodes]?.filter(Boolean);
  }, [lpBalanceListData, totalBalanceData]);

  const expandedRowKeys = useMemo(() => processedData?.filter((item) => item.level <= 0)?.map((item) => item.id), [processedData]);

  const lpBalanceColumns = useMemo(
    () => [
      {
        dataField: 'currency',
        caption: t('currency'),
        cellRender: (cellInfo: any) => {
          const { type, name, currency } = cellInfo.data;
          if (type === 'lp') return <span className={styles['c-lp-balance__title']}>{name}</span>;
          if (type === 'account') return <span className={styles['c-lp-balance__sub-title']}>{currency}</span>;
          if (type === 'coin') return currency;
          if (type === 'total') return <span className={styles['c-lp-balance__total-title']}>TOTAL</span>;
          return '';
        },
      },
      {
        dataField: 'quantity',
        caption: t('quantity'),
        cellRender: (cellInfo: any) => (cellInfo.data.type === 'coin' ? cellInfo.data.quantity : ''),
      },
      {
        dataField: 'balance',
        caption: t('balanceUSDT'),
        cellRender: (cellInfo: any) => {
          const { type, balance } = cellInfo.data;
          const isSummary = ['total', 'lp', 'account'].includes(type);
          const value = isSummary ? parseFloat(balance).toFixed(2) : balance;
          return <span className={isSummary ? styles['c-lp-balance__totals'] : ''}>{value}</span>;
        },
      },
      {
        dataField: 'available',
        caption: t('availableBalanceUSDT'),
        cellRender: (cellInfo: any) => {
          const { type, available } = cellInfo.data;
          const isSummary = ['total', 'lp', 'account'].includes(type);
          const value = isSummary ? parseFloat(available).toFixed(2) : available;
          return <span className={isSummary ? styles['c-lp-balance__totals'] : ''}>{value}</span>;
        },
      },
    ],
    [t]
  );

  const handleExportExcel = async () => {
    if (treeListRef.current) {
      const { exportTreeListToExcel } = await import('../../utils/excel-export');
      exportTreeListToExcel(treeListRef, 'lp-balance.xlsx');
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      await dispatch(getLpBalanceList());
    };
    fetchApi();
  }, []);

  return (
    <section className={styles['c-lp-balance']}>
      <PageTitle type='data' title={t('lp_balances')} svg={<ILpBalance />} />
      <div className={styles['c-lp-balance__detail-grid']}>
        <div className={styles['c-lp-balance__export-container']}>
          <ButtonIcon title={t('export')} icon={<ExcelExportIcon />} handleClick={handleExportExcel} />
        </div>
        <TreeList
          ref={treeListRef}
          dataSource={processedData}
          keyExpr='id'
          parentIdExpr='parentId'
          rootValue={null}
          defaultExpandedRowKeys={expandedRowKeys}
          showRowLines={true}
          showBorders={true}
          columnAutoWidth={false}
          width='100%'
          height={'71vh'}
          className={styles['c-lp-balance__tree-list']}
          onRowPrepared={(e: any) => {
            if (e.rowType === 'data' && e.data.type === 'total') {
              e.rowElement.classList.add(styles['c-lp-balance__total-row']);
            }
          }}>
          {lpBalanceColumns?.map((column, index) => (
            <Column key={index} dataField={column.dataField} caption={column.caption} cellRender={column.cellRender} width={'25%'} allowResizing={false} allowSorting={false} />
          ))}
        </TreeList>
      </div>
    </section>
  );
};

export default LpBalance;
