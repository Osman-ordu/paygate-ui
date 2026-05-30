import axios from 'axios';
import { customHistory } from '../../routes/History';
import { apiEnvUrl, isAllowedRequest, setLocalStorageItem, clearLocalStorage } from '../general';
import { toastError, toastSuccess } from '../../components/Toast';

export interface initialStateType {
  method?: string;
  url?: string;
  data?: object | [] | null;
  params?: object | [] | null;
}

let isRefreshing = false;

const asyncFunc = async () => {
  if (isRefreshing) return;
  isRefreshing = true;
  try {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await CallApi({
      url: `/api/Auth/refreshToken`,
      method: 'POST',
      data: { token, refreshToken },
    });
    setLocalStorageItem('token', data.token);
    setLocalStorageItem('refreshToken', data.refreshToken);
    customHistory.go(0);
  } catch {
    clearLocalStorage();
    customHistory.replace('/auth/login');
  } finally {
    isRefreshing = false;
  }
};

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    const statusCode = err.response?.status;
    const url: string = err.config?.url ?? '';
    if (statusCode === 401) {
      if (url.includes('/api/Auth/refreshToken')) {
        clearLocalStorage();
        customHistory.replace('/auth/login');
      } else {
        asyncFunc();
      }
    } else if (statusCode === 498) {
      clearLocalStorage();
      customHistory.replace('/auth/login');
    }
    throw err;
  }
);

export const CallApi = async ({ method, url, data, params }: initialStateType) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios({
      method,
      url: `${apiEnvUrl}${url}`,
      data: data ?? {},
      params: params ?? {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!isAllowedRequest(method, url)) toastSuccess('Operation is Successful');
    return response.data;
  } catch (error: any) {
    toastError(error?.response?.data?.message || error?.message || 'Connection Unsuccessful');
    throw new Error('Connection Unsuccessful');
  }
};
