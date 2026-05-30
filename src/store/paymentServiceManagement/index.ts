import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getPaymentServiceManagement = createAsyncThunk('getPaymentServiceManagementReducer', async () => {
  return await CallApi({
    url: `/api/Setting/serviceManagement`,
    method: 'GET',
  });
});

export const putPaymentServiceManagement = createAsyncThunk('putPaymentServiceManagementReducer', async (data: any) => {
  return await CallApi({
    url: `/api/Setting/serviceManagement`,
    method: 'PUT',
    data: data,
  });
});

export const getPaymentServiceManagementReducer = createSliceModule('getPaymentServiceManagementReducer', getPaymentServiceManagement).reducer;
