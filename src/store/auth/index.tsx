import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { encryptData, setLocalStorageItem, clearLocalStorage } from '../../utils/general';
interface UserCredentials {
  email: string | number;
  password: string | number;
  oldPassword: string | number;
  newPassword: string | number;
}

export const login = createAsyncThunk('login', async ({ email, password }: any) => {
  const config = {
    url: `/api/Auth/newLogin`,
    method: 'POST',
    data: {
      email,
      password,
    },
  };
  const response = await CallApi(config);
  return response;
});

export const loginVerify = createAsyncThunk('loginVerify', async ({ email, code }: any) => {
  const config = {
    url: `/api/Auth/verifyCode`,
    method: 'POST',
    data: {
      email,
      code,
    },
  };
  const response = await CallApi(config);
  if (response.data) {
    clearLocalStorage();
    const moduleInfo = JSON.stringify(response.data.profileInfo.moduleInfo);
    const encryptedModule = encryptData(String(moduleInfo));
    setLocalStorageItem('token', response.data.token);
    setLocalStorageItem('refreshToken', response.data.refreshToken);
    setLocalStorageItem('isEASL', encryptedModule);
    setLocalStorageItem('userEmail', email);
    setLocalStorageItem('language', 'en');
    window.location.href = '/deposit';
  }
  return response;
});

export const changePassword = createAsyncThunk('changePassword', async ({ oldPassword, newPassword }: UserCredentials) => {
  return await CallApi({
    url: `/api/Auth/reset`,
    method: 'POST',
    data: {
      oldPassword,
      newPassword,
    },
  });
});

export const putResetGoogleAuth = createAsyncThunk('putResetGoogleAuth', async ({ id }: any) => {
  return await CallApi({
    url: `/api/User/reset?id=${id}`,
    method: 'PUT',
  });
});
