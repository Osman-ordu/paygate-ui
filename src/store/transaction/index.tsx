import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getTransactionData = createAsyncThunk('transaction', async () => {
  return await CallApi({
    url: `/api/Transaction`,
    method: 'GET',
  });
});

export const transactionReducer = createSliceModule('transactionSlice', getTransactionData).reducer;
