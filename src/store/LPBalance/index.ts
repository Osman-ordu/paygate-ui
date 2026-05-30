import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getLpBalanceList = createAsyncThunk('getLpBalanceListReducer', async () => {
  return await CallApi({
    url: `/api/LPTransaction/balance`,
    method: 'GET',
  });
});

export const getLpBalance = createAsyncThunk('getLpBalanceReducer', async () => {
  return await CallApi({
    url: `/api/LPTransaction/lpbalance`,
    method: 'GET',
  });
});

export const getLpBalanceListReducer = createSliceModule('getLpBalanceListReducer', getLpBalanceList).reducer;
export const getLpBalanceReducer = createSliceModule('getLpBalanceReducer', getLpBalance).reducer;
