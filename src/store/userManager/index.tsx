import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const putChangeStatus = createAsyncThunk('userManager', async ({ id }: any) => {
  return await CallApi({
    url: `/api/User/change-status/?id=${id}`,
    method: 'PUT',
  });
});

export const addUser = createAsyncThunk('userManager', async (params: any) => {
  return await CallApi({
    url: `/api/Auth/register`,
    method: 'POST',
    data: params,
  });
});

export const editUser = createAsyncThunk('editUser', async (params: any) => {
  return await CallApi({
    url: `/api/User`,
    method: 'PUT',
    data: params,
  });
});

export const userManagerReducer = createSliceModule('userManagerSlice', putChangeStatus).reducer;
