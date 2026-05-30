import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getWhiteListAccounts = createAsyncThunk('getWhiteListAccountsReducer', async () => {
  return await CallApi({
    url: `/api/Whitelist`,
    method: 'GET',
  });
});

export const addWhiteListAccounts = createAsyncThunk('addWhiteListAccountsReducer', async (data: any) => {
  return await CallApi({
    url: `/api/WhiteList/add`,
    method: 'POST',
    data: data,
  });
});

export const editWhiteListAccounts = createAsyncThunk('editWhiteListAccountsReducer', async (data: any) => {
  return await CallApi({
    url: `/api/WhiteList/update`,
    method: 'POST',
    data: data,
  });
});

export const changeStatusWhiteListAccounts = createAsyncThunk('changeStatusWhiteListAccountsReducer', async (id: any) => {
  return await CallApi({
    url: `/api/Whitelist/changestatus/${id}`,
    method: 'GET',
  });
});

export const getWhiteListAccountsReducer = createSliceModule('getWhiteListAccountsReducer', getWhiteListAccounts).reducer;
