import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Table, Tag, Popconfirm } from 'antd';
import { useAppDispatch } from '../../store/hooks';
import { getPendingUsers, approveUser } from '../../store/pendingUsers';
import PageTitle from '../../components/PageTitle';
import Loader from '../../components/Loader';
import UserManagement from '../../assets/svg/UserManagement.svg?react';
import styles from '../UserManager/styles.module.scss';

export default function UserApprovals() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchPending = async () => {
    setIsLoading(true);
    const res = await dispatch(getPendingUsers());
    setUsers((res.payload as any)?.data || []);
    setIsLoading(false);
  };

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    const res = await dispatch(approveUser({ id }));
    if ((res.payload as any)?.success) {
      await fetchPending();
    }
    setApprovingId(null);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const columns = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, row: any) => `${row.name} ${row.surname}`,
    },
    { title: t('email'), dataIndex: 'email', key: 'email' },
    { title: 'Tel', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    {
      title: t('registered_at'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => v ? new Date(v).toLocaleString('tr-TR') : '-',
    },
    {
      title: t('status'),
      key: 'status',
      render: () => <Tag color='orange'>{t('pending_approval')}</Tag>,
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_: any, row: any) => (
        <Popconfirm
          title={`${row.name} ${row.surname} kullanıcısını onaylamak istediğinize emin misiniz?`}
          onConfirm={() => handleApprove(row.id)}
          okText={t('approve')}
          cancelText={t('cancel')}>
          <Button
            type='primary'
            size='small'
            loading={approvingId === row.id}>
            {t('approve')}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <section className={styles['c-user-manager']}>
      <PageTitle type='data' svg={<UserManagement />} title={t('user_approvals')} />
      {isLoading ? (
        <Loader />
      ) : (
        <Table
          dataSource={users}
          columns={columns}
          rowKey='id'
          locale={{ emptyText: 'Onay bekleyen kullanıcı yok' }}
          pagination={{ pageSize: 20 }}
        />
      )}
    </section>
  );
}
