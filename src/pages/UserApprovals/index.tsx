import { useEffect, useState } from 'react';
import { Button, Table, Tag, Popconfirm, Tabs, Space, Tooltip, message } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MailOutlined,
  StopOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from '../../store/hooks';
import { getAllUsers, approveUser, rejectUser, resendApproval, setUserStatus } from '../../store/pendingUsers';
import PageTitle from '../../components/PageTitle';
import Loader from '../../components/Loader';
import UserManagement from '../../assets/svg/UserManagement.svg?react';
import styles from '../UserManager/styles.module.scss';

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
      if ((res.payload as any)?.success) message.success('QR e-postası gönderildi');
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
      title: 'Ad Soyad',
      key: 'fullName',
      render: (_: any, row: UserRow) => `${row.name} ${row.surname}`,
    },
    { title: 'E-posta', dataIndex: 'email', key: 'email' },
    { title: 'Telefon', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    {
      title: 'Kayıt Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => (v ? new Date(v).toLocaleString('tr-TR') : '-'),
    },
    {
      title: 'Durum',
      key: 'durum',
      render: (_: any, row: UserRow) => {
        const s = getUserStatus(row);
        const { label, color } = STATUS_MAP[s];
        const icon =
          s === 'pending' ? <ClockCircleOutlined /> : s === 'active' ? <CheckCircleOutlined /> : <StopOutlined />;
        return (
          <Tag color={color} icon={icon}>
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: any, row: UserRow) => {
        const s = getUserStatus(row);
        const busy = loadingId === row.id;

        if (s === 'pending') {
          return (
            <Space>
              <Popconfirm
                title={`${row.name} ${row.surname} onaylansın mı?`}
                onConfirm={() => handleApprove(row.id)}
                okText="Onayla"
                cancelText="Vazgeç">
                <Button type="primary" size="small" loading={busy} icon={<CheckCircleOutlined />}>
                  Onayla
                </Button>
              </Popconfirm>
              <Popconfirm
                title={`${row.name} ${row.surname} reddedilsin mi?`}
                onConfirm={() => handleReject(row.id)}
                okText="Reddet"
                okButtonProps={{ danger: true }}
                cancelText="Vazgeç">
                <Button danger size="small" loading={busy} icon={<CloseCircleOutlined />}>
                  Reddet
                </Button>
              </Popconfirm>
            </Space>
          );
        }

        if (s === 'active') {
          return (
            <Space>
              <Popconfirm
                title={`${row.name} ${row.surname} pasife alınsın mı? Kullanıcı giriş yapamaz.`}
                onConfirm={() => handleToggleStatus(row.id, false)}
                okText="Pasife Al"
                okButtonProps={{ danger: true }}
                cancelText="Vazgeç">
                <Button danger size="small" loading={busy} icon={<StopOutlined />}>
                  Pasife Al
                </Button>
              </Popconfirm>
              <Tooltip title="QR kodunu yeniden e-posta ile gönder">
                <Popconfirm
                  title="QR kodu tekrar e-posta ile gönderilsin mi?"
                  onConfirm={() => handleResend(row.id)}
                  okText="Gönder"
                  cancelText="Vazgeç">
                  <Button size="small" loading={busy} icon={<MailOutlined />}>
                    QR Gönder
                  </Button>
                </Popconfirm>
              </Tooltip>
            </Space>
          );
        }

        return (
          <Space>
            <Popconfirm
              title={`${row.name} ${row.surname} aktife alınsın mı?`}
              onConfirm={() => handleToggleStatus(row.id, true)}
              okText="Aktife Al"
              cancelText="Vazgeç">
              <Button type="primary" size="small" loading={busy} icon={<PlayCircleOutlined />}>
                Aktife Al
              </Button>
            </Popconfirm>
            <Tooltip title="QR kodunu yeniden e-posta ile gönder">
              <Popconfirm
                title="QR kodu tekrar e-posta ile gönderilsin mi?"
                onConfirm={() => handleResend(row.id)}
                okText="Gönder"
                cancelText="Vazgeç">
                <Button size="small" loading={busy} icon={<MailOutlined />}>
                  QR Gönder
                </Button>
              </Popconfirm>
            </Tooltip>
          </Space>
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

      <div style={{ marginBottom: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Tag color="orange" icon={<ClockCircleOutlined />}>
          Onay Bekliyor — Kaydoldu, admin onayı bekleniyor
        </Tag>
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Aktif — Onaylandı, giriş yapabilir
        </Tag>
        <Tag color="red" icon={<StopOutlined />}>
          Pasif — Girişe kapalı (reddedildi veya devre dışı bırakıldı)
        </Tag>
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
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          locale={{ emptyText: 'Kullanıcı bulunamadı' }}
          pagination={{ pageSize: 20 }}
        />
      )}
    </section>
  );
}
