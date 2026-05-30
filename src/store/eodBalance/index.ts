import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getEodBalanceList = createAsyncThunk('getEodBalanceListReducer', async ({ date }: { date: string }) => {
  return await CallApi({
    url: `/api/EODBalance?date=${date}`,
    method: 'GET',
  });
});

export const putEodBalance = createAsyncThunk('getEodBalanceReducer', async (data: any) => {
  return await CallApi({
    url: `/api/EODBalance`,
    method: 'PUT',
    data: data,
  });
});

export const getEodBalanceListReducer = createSliceModule('getEodBalanceListReducer', getEodBalanceList).reducer;
