import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { toast } from 'react-toastify';
import CDataGrid from '../../components/CDataGrid/Lazy';
import styles from './styles.module.scss';
import { useAppDispatch } from '../../store/hooks';
import { getAllUsers, approveUser, rejectUser, resendApproval, setUserStatus } from '../../store/pendingUsers';
import PageTitle from '../../components/PageTitle';
import Loader from '../../components/Loader';
import UserManagement from '../../assets/svg/UserManagement.svg?react';

type UserRow = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  status: number;
  pendingApproval: boolean;
  createdAt: string;
};

type TabKey = 'all' | 'pending' | 'active' | 'passive';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'Onay Bekliyor', color: 'orange' },
  active: { label: 'Aktif', color: 'green' },
  passive: { label: 'Pasif', color: 'red' },
};

function getUserStatus(user: UserRow): 'pending' | 'active' | 'passive' {
  if (user.pendingApproval) return 'pending';
  if (user.status === 1) return 'active';
  return 'passive';
}

export default function UserApprovals() {
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const fetchAll = async () => {
    setIsLoading(true);
    const res = await dispatch(getAllUsers());
    setUsers(((res.payload as any)?.data as UserRow[]) || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const withLoading = async (id: string, action: () => Promise<any>) => {
    setLoadingId(id);
    try {
      const res = await action();
      if ((res.payload as any)?.success) {
        await fetchAll();
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleApprove = (id: string) =>
    withLoading(id, () => dispatch(approveUser({ id })));

  const handleReject = (id: string) =>
    withLoading(id, () => dispatch(rejectUser({ id })));

  const handleResend = (id: string) =>
    withLoading(id, async () => {
      const res = await dispatch(resendApproval({ id }));
      if ((res.payload as any)?.success) toast.success('QR e-postası gönderildi');
      return res;
    });

  const handleToggleStatus = (id: string, enable: boolean) =>
    withLoading(id, () => dispatch(setUserStatus({ id, enabled: enable })));

  const filtered = users.filter((u) => {
    if (activeTab === 'all') return true;
    return getUserStatus(u) === activeTab;
  });

  const counts = {
    all: users.length,
    pending: users.filter((u) => getUserStatus(u) === 'pending').length,
    active: users.filter((u) => getUserStatus(u) === 'active').length,
    passive: users.filter((u) => getUserStatus(u) === 'passive').length,
  };

  const columns = [
    {
      dataField: 'fullName',
      caption: 'name',
      cellRender: (cellData: any) => `${cellData.data.name} ${cellData.data.surname}`,
      addition: { minWidth: 120 },
    },
    { dataField: 'email', caption: 'email', addition: { minWidth: 160 } },
    { dataField: 'phoneNumber', caption: 'phone', addition: { minWidth: 120 } },
    {
      dataField: 'createdAt',
      caption: 'registered_at',
      addition: { minWidth: 130 },
      cellRender: (cellData: any) =>
        cellData.value ? new Date(cellData.value).toLocaleString('tr-TR') : '-',
    },
    {
      dataField: 'status',
      caption: 'status',
      addition: { alignment: 'center' as const, width: 130 },
      cellRender: (cellData: any) => {
        const s = getUserStatus(cellData.data);
        const { label, color } = STATUS_MAP[s];
        return <span className={styles[`status-${s}`]} style={{ color }}>{label}</span>;
      },
    },
    {
      dataField: 'actions',
      caption: 'actions',
      addition: { alignment: 'center' as const, minWidth: 200 },
      cellRender: (cellData: any) => {
        const row: UserRow = cellData.data;
        const s = getUserStatus(row);
        const busy = loadingId === row.id;

        const btn = (label: string, variant: 'primary' | 'danger' | 'default', onClick: () => void) => (
          <button
            className={`${styles['action-btn']} ${styles[`action-btn--${variant}`]}`}
            onClick={onClick}
            disabled={busy}
          >
            {label}
          </button>
        );

        if (s === 'pending') return (
          <div className={styles['action-group']}>
            {btn('Onayla', 'primary', () => window.confirm(`${row.name} ${row.surname} onaylansın mı?`) && handleApprove(row.id))}
            {btn('Reddet', 'danger',  () => window.confirm(`${row.name} ${row.surname} reddedilsin mi?`)  && handleReject(row.id))}
          </div>
        );

        if (s === 'active') return (
          <div className={styles['action-group']}>
            {btn('Pasife Al', 'danger',   () => window.confirm(`${row.name} ${row.surname} pasife alınsın mı?`) && handleToggleStatus(row.id, false))}
            {btn('QR Gönder', 'default', () => window.confirm('QR kodu tekrar gönderilsin mi?') && handleResend(row.id))}
          </div>
        );

        return (
          <div className={styles['action-group']}>
            {btn('Aktife Al',  'primary', () => window.confirm(`${row.name} ${row.surname} aktife alınsın mı?`) && handleToggleStatus(row.id, true))}
            {btn('QR Gönder', 'default', () => window.confirm('QR kodu tekrar gönderilsin mi?') && handleResend(row.id))}
          </div>
        );
      },
    },
  ];

  const tabItems = [
    { key: 'all', label: `Tümü (${counts.all})` },
    { key: 'pending', label: `Onay Bekliyor (${counts.pending})` },
    { key: 'active', label: `Aktif (${counts.active})` },
    { key: 'passive', label: `Pasif (${counts.passive})` },
  ];

  return (
    <section className={styles['c-user-manager']}>
      <PageTitle type="data" svg={<UserManagement />} title="Kullanıcı Yönetimi" />

      <div className={styles['legend']}>
        <span className={styles['status-pending']}>⏱ Onay Bekliyor — Kaydoldu, admin onayı bekleniyor</span>
        <span className={styles['status-active']}>✓ Aktif — Onaylandı, giriş yapabilir</span>
        <span className={styles['status-passive']}>✕ Pasif — Girişe kapalı</span>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as TabKey)}
        items={tabItems}
        style={{ marginBottom: 0 }}
      />

      {isLoading ? (
        <Loader />
      ) : (
        <CDataGrid
          gridKey='user-approvals'
          stateStore='NO'
          data={filtered}
          columns={columns}
          editButtonVisible={false}
          deleteButtonVisible={false}
          addLogicVisible={false}
          height='72vh'
          paging={true}
          pageSize={20}
        />
      )}
    </section>
  );
}
