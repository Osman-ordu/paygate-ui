import dayjs from 'dayjs';
import { SortableData } from '../../dbProps';
import { allowedEndpoints, encryptionKey } from '../../db';
import { allTBanksEnum } from '../../db/Enums';

export const apiEnvUrl = import.meta.env.VITE_API_BASE_URL;

// Deposit helper
export const sortDataByDateDeposit = (data: SortableData[] = []) => {
  return data.slice().sort((a, b) => {
    const dateA = new Date(a.depositDate);
    const dateB = new Date(b.depositDate);
    return dateB.getTime() - dateA.getTime();
  });
};

export const formatterIban = (iban: string): string => {
  return iban.replace(/(.{4})/g, '$1 ').trim();
};

export const formatterAmount = (amount: number) => {
  return amount?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const bankFind = (iban: string) => {
  const bankaKodu = iban.substring(4, 7);
  return allTBanksEnum[bankaKodu] ?? '';
};

export const extractBankCodeFromIban = (iban: string): string => {
  if (!iban) return '';
  return iban.replace('TR', '').substring(4, 7);
};

export const isAllowedRequest = (method: any, url: any): boolean => {
  if (method === 'GET') return true;
  return [...allowedEndpoints].some((endpoint) => url.includes(endpoint));
};

export const renderCellFix = (item: any) => {
  return formatterAmount(item);
};

export const formatLargeNumberString = (numStr: string): string => {
  if (!numStr) return numStr;

  const str = numStr.trim();
  const isNegative = str.startsWith('-');
  const clean = isNegative ? str.slice(1) : str;

  const [integerPartRaw, decimalPartRaw] = clean.split('.');

  const reversed = integerPartRaw.split('').reverse();
  const withCommas = reversed.reduce((acc, digit, idx) => {
    acc += digit;
    if ((idx + 1) % 3 === 0 && idx + 1 !== reversed.length) acc += ',';
    return acc;
  }, '');
  const formattedInt = withCommas.split('').reverse().join('');

  const formatted = decimalPartRaw ? `${formattedInt}.${decimalPartRaw}` : formattedInt;

  return isNegative ? `-${formatted}` : formatted;
};

export const renderCellWithZeroAndLargeNumberMask = (item: any) => {
  if (item === null || item === undefined || item === '') return '-';

  const strValue = String(item).trim();
  const isNegative = strValue.startsWith('-');
  const cleanValue = isNegative ? strValue.slice(1) : strValue;

  if (!/^\d+(\.\d+)?$/.test(cleanValue)) return item;

  if (/^0+(\.0+)?$/.test(cleanValue)) {
    return '0';
  }

  const formatted = formatLargeNumberString(cleanValue);

  return isNegative ? `-${formatted}` : formatted;
};

export const formatDateWithOffset = (value: any): string => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/.test(value)) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        date.setTime(date.getTime() - 3 * 60 * 60 * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        const result = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;

        return result;
      }
    } catch (e) {
      void e;
    }
  }
  return String(value);
};

export const formatDateTimeForDisplay = (value: any): string => {
  if (!value) return '-';

  try {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      let localDate = date;
      // Eğer tarih UTC formatında ise (Z ile bitiyorsa) timezone dönüşümü yap
      if (typeof value === 'string' && value.endsWith('Z')) {
        // UTC'den yerel saate dönüştür (Türkiye saati için -3 saat)
        localDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);
      }

      const day = String(localDate.getDate()).padStart(2, '0');
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const year = localDate.getFullYear();
      const hours = String(localDate.getHours()).padStart(2, '0');
      const minutes = String(localDate.getMinutes()).padStart(2, '0');
      const seconds = String(localDate.getSeconds()).padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
  } catch (e) {
    void e;
  }

  return String(value);
};

export const transformFilter = (data: any[]): any[] => {
  const result: any[] = [];
  const processItem = (item: any) => {
    if (Array.isArray(item) && item.length === 3 && typeof item[0] === 'string') {
      result.push({
        field: item[0],
        op: item[1],
        result: formatDateWithOffset(item[2]),
      });
    } else if (Array.isArray(item)) {
      item.forEach(processItem);
    }
  };

  processItem(data);
  return result;
};

export const transformSort = (data: { selector: string; desc: boolean }[]) => {
  return {
    field: data[0].selector,
    desc: data[0].desc,
  };
};

export const formatterPhoneNumber = (input: any) => {
  const phoneNumberOnlyDigits = input.replace(/\D/g, '');
  const maxLength = 11;
  const truncatedPhoneNumber = phoneNumberOnlyDigits.slice(0, maxLength);
  const formattedPhoneNumber = truncatedPhoneNumber.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '0 ($2) $3 $4');

  return formattedPhoneNumber;
};

export const encryptData = (data: any) => {
  let encrypted = '';
  for (let i = 0; i < data.length; i++) {
    encrypted += String.fromCharCode(data.charCodeAt(i) + encryptionKey.charCodeAt(i % encryptionKey?.length));
  }
  return encrypted;
};

export const decryptData = (encryptedData: any) => {
  let decrypted = '';
  for (let i = 0; i < encryptedData?.length; i++) {
    decrypted += String.fromCharCode(encryptedData.charCodeAt(i) - encryptionKey.charCodeAt(i % encryptionKey?.length));
  }
  return decrypted;
};

export const getEncryptModuleData = () => {
  const encryptedProfileID = localStorage.getItem('isEASL');
  return encryptedProfileID && JSON.parse(decryptData(encryptedProfileID));
};

export const customTitleText = (language: string, serviceName: string, status: boolean) => {
  if (language === 'tr') {
    return `"${serviceName}" servisini ${status ? 'devre dışı bırakmak' : 'etkinleştirmek'}  istediğinize emin misiniz ?`;
  }
  if (language === 'en') {
    return `Are you sure you want to ${status ? 'disable' : 'enable'} "${serviceName}"?`;
  }
  return '';
};

export const getPaymentServiceManagementEditTableData = (selectedRowData: any, t: (key: string) => string) => [
  {
    key: 'serviceName',
    label: t('serviceName'),
    value: selectedRowData?.serviceName || '-',
  },
  {
    key: 'lastUpdateBy',
    label: t('lastUpdateBy'),
    value: selectedRowData?.lastUpdateBy || '-',
  },
  {
    key: 'lastUpdateAt',
    label: t('lastUpdateAt'),
    value: selectedRowData?.lastUpdateAt ? dayjs(selectedRowData.lastUpdateAt).subtract(3, 'hour').format('DD/MM/YYYY HH:mm:ss') : '-',
  },
  {
    key: 'status',
    label: t('status'),
    value: selectedRowData?.status === true ? t('active') : t('passive'),
  },
];

export const preventNonNumericKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === '+' || e.key === '-' || e.key === 'e') {
    e.preventDefault();
  }
};

export const createKeyGenerator = (prefix: string = 'key') => {
  let counter = 0;
  return () => `${prefix}-${++counter}`;
};

export const generateMenuKey = createKeyGenerator('menu');
export const generateItemKey = createKeyGenerator('item');

// localStorage utilities for authentication
export const setLocalStorageItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
  if (key === 'token' || key === 'refreshToken' || key === 'isEASL') {
    window.dispatchEvent(new Event('localStorageChange'));
  }
};

export const removeLocalStorageItem = (key: string) => {
  localStorage.removeItem(key);
  if (key === 'token' || key === 'refreshToken' || key === 'isEASL') {
    window.dispatchEvent(new Event('localStorageChange'));
  }
};

export const clearLocalStorage = () => {
  localStorage.clear();
  window.dispatchEvent(new Event('localStorageChange'));
};

export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const encryptedModuleData = localStorage.getItem('isEASL');

    if (!token || !refreshToken || !encryptedModuleData) {
      return false;
    }

    if (!isValidJWTFormat(token)) {
      return false;
    }

    if (isTokenExpired(token)) {
      return false;
    }

    try {
      const decryptedData = JSON.parse(decryptData(encryptedModuleData));
      if (!decryptedData || !Array.isArray(decryptedData)) {
        return false;
      }
    } catch (error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

const isValidJWTFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  return parts.length === 3;
};

const isTokenExpired = (token: string): boolean => {
  try {
    if (!isValidJWTFormat(token)) {
      return true;
    }

    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));

    if (!decodedPayload.exp) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decodedPayload.exp < currentTime;
  } catch (error) {
    return true;
  }
};
