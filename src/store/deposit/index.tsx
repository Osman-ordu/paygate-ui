import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getDepositData = createAsyncThunk('deposit', async () => {
  return await CallApi({
    url: `/api/Deposit`,
    method: 'GET',
  });
});

export const getDepositLog = createAsyncThunk('getDepositLog', async (transactionId: string) => {
  return await CallApi({
    url: `/api/Deposit/log?DepositId=${transactionId}`,
    method: 'GET',
  });
});

export const updateDepositStatus = createAsyncThunk('updateDepositStatus', async (data: any) => {
  return await CallApi({
    url: `/api/Deposit/updateStatus`,
    method: 'POST',
    data,
  });
});

export const depositLogReducer = createSliceModule('depositLogSlice', getDepositLog).reducer;
export const depositReducer = createSliceModule('depositSlice', getDepositData).reducer;
