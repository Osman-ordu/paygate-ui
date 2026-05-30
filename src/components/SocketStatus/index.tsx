import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { getSeverHealthCheck } from '../../store/healthCheck';
import SocketIcon from '../../assets/svg/Socket.svg?react';
import ReSocketIcon from '../../assets/svg/ReSocket.svg?react';
import TickIcon from '../../assets/svg/Tick.svg?react';
import CancelIcon from '../../assets/svg/CancelIcon.svg?react';
import styles from './styles.module.scss';

export default function SocketStatus() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const serviceData = useAppSelector((state) => state.getSeverHealthCheckValue?.data?.data);
  const isLoading = useAppSelector((state) => state.getSeverHealthCheckValue?.isLoading);
  const isError = useAppSelector((state) => state.getSeverHealthCheckValue?.isError);

  const transformedServiceData =
    serviceData?.reduce(
      (acc: Record<string, boolean>, item: Record<string, boolean>) => {
        const [serviceName, isConnected] = Object.entries(item)[0];
        acc[serviceName] = isConnected;
        return acc;
      },
      {} as Record<string, boolean>
    ) || {};

  const atLeastOneConnected = Object.values(transformedServiceData)?.some(Boolean);
  const allConnected = Object.values(transformedServiceData)?.every(Boolean);
  const hasServiceData = Object.keys(transformedServiceData).length > 0;

  const toggleDropdown = () => {
    if (!hasServiceData && !isLoading) return;
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      await dispatch(getSeverHealthCheck());
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 300000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const LoadingSpinner = () => (
    <div className={styles['c-socket-status__loading']}>
      <div className={styles['c-socket-status__spinner']}></div>
    </div>
  );

  return (
    <section className={styles['c-socket-status']}>
      <div className={styles['c-socket-status__dropdown-container']}>
        <button className={styles['c-socket-status__dropdown-trigger']} onClick={toggleDropdown} type='button' disabled={!hasServiceData && !isLoading}>
          {allConnected ? <SocketIcon width={18} height={18} /> : <ReSocketIcon width={18} height={18} />}
        </button>

        {isDropdownOpen && (hasServiceData || isLoading) && (
          <div className={styles['c-socket-status__dropdown']}>
            {isLoading ? (
              <div className={styles['c-socket-status__dropdown-item']}>
                <span className={styles['c-socket-status__service-name']}>{t('loading')}</span>
                <LoadingSpinner />
              </div>
            ) : isError ? (
              <div className={styles['c-socket-status__dropdown-item']}>
                <span className={styles['c-socket-status__service-name']}>{t('connectionError')}</span>
                <CancelIcon className={styles['c-socket-status__close-icon']} />
              </div>
            ) : (
              Object.entries(transformedServiceData).map(([serviceName, isConnected]) => (
                <div key={serviceName} className={styles['c-socket-status__dropdown-item']}>
                  <span className={styles['c-socket-status__service-name']}>{serviceName}</span>
                  {isConnected ? <TickIcon className={styles['c-socket-status__success']} /> : <CancelIcon className={styles['c-socket-status__close-icon']} />}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className={styles['c-socket-status__seperator']} />

      {atLeastOneConnected ? <TickIcon width={18} height={18} /> : <CancelIcon className={styles['c-socket-status__close-icon']} width={18} height={18} />}

      <div className={styles['c-socket-status__text']}>
        {isLoading ? (
          <p className={styles['c-socket-status__text-title-loading']}>{t('serviceStatusChecking')}</p>
        ) : isError ? (
          <p className={styles['c-socket-status__text-title-error']}>{t('connectionError')}</p>
        ) : atLeastOneConnected ? (
          <p className={styles['c-socket-status__text-title-success']}>{t('serviceConnection')}</p>
        ) : (
          <p className={styles['c-socket-status__text-title-failed']}>{t('serviceConnectionFailed')}</p>
        )}
      </div>
    </section>
  );
}
