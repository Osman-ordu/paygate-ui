import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getWithdrawalData = createAsyncThunk('deposit', async () => {
  return await CallApi({
    url: `/api/Withdrawal`,
    method: 'GET',
  });
});

export const getWithdrawalLog = createAsyncThunk('getWithdrawalLog', async (transactionId: string) => {
  return await CallApi({
    url: `/api/Withdrawal/log?transactionId=${transactionId}`,
    method: 'GET',
  });
});

export const withdrawalLogReducer = createSliceModule('withdrawalLogSlice', getWithdrawalLog).reducer;
export const withdrawalReducer = createSliceModule('withdrawalSlice', getWithdrawalData).reducer;
