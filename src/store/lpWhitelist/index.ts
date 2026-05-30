import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getLpWhitelist = createAsyncThunk('getLpWhitelistReducer', async () => {
  return await CallApi({
    url: `/api/LPWhitelist`,
    method: 'GET',
  });
});

export const getLpWhitelistActiveList = createAsyncThunk('getLpWhitelistActiveListReducer', async () => {
  return await CallApi({
    url: `/api/LPWhitelist/getActiveList`,
    method: 'GET',
  });
});

export const getLpWhiteListById = createAsyncThunk('getLpWhiteListByIdReducer', async (id: any) => {
  return await CallApi({
    url: `/api/LPWhitelist/${id}`,
    method: 'GET',
  });
});

export const getLpOkxVaspList = createAsyncThunk('getLpOkxVaspListReducer', async () => {
  return await CallApi({
    url: `/api/LPWhitelist/okxVaspName`,
    method: 'GET',
  });
});

export const addLpWhitelist = createAsyncThunk('addLpWhitelistReducer', async (data: any) => {
  return await CallApi({
    url: `/api/LPWhitelist`,
    method: 'POST',
    data: data,
  });
});

export const changeStatusLpWhitelist = createAsyncThunk('changeStatusLpWhitelistReducer', async (id: any) => {
  return await CallApi({
    url: `/api/LPWhitelist/changeStatus/${id}`,
    method: 'PUT',
  });
});

export const deleteLpWhitelist = createAsyncThunk('deleteLpWhitelistReducer', async (id: any) => {
  return await CallApi({
    url: `/api/LPWhitelist/${id}`,
    method: 'DELETE',
  });
});

export const editLpWhitelist = createAsyncThunk('editLpWhitelistReducer', async (data: any) => {
  return await CallApi({
    url: `/api/LPWhitelist`,
    method: 'PUT',
    data: data,
  });
});

export const getLpWhitelistReducer = createSliceModule('getLpWhitelistReducer', getLpWhitelist).reducer;
export const getLpWhitelistActiveListReducer = createSliceModule('getLpWhitelistActiveListReducer', getLpWhitelistActiveList).reducer;
export const getLpWhiteListByIdReducer = createSliceModule('getLpWhiteListByIdReducer', getLpWhiteListById).reducer;
export const getLpOkxVaspListReducer = createSliceModule('getLpOkxVaspListReducer', getLpOkxVaspList).reducer;
