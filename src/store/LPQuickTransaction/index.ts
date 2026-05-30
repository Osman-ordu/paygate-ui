import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getLPQuickTransaction = createAsyncThunk('getLPQuickTransaction', async () => {
  return await CallApi({
    url: `/api/LPQuickTransaction`,
    method: 'GET',
  });
});

export const addLPQuickTransaction = createAsyncThunk('addLPQuickTransaction', async (params: any) => {
  return await CallApi({
    url: `/api/LPQuickTransaction`,
    method: 'POST',
    data: params,
  });
});

export const deleteLPQuickTransaction = createAsyncThunk('deleteLPQuickTransaction', async (id: any) => {
  return await CallApi({
    url: `/api/LPQuickTransaction?id=${id}`,
    method: 'DELETE',
  });
});

export const getLPQuickTransactionReducer = createSliceModule('getLPQuickTransactionSlice', getLPQuickTransaction).reducer;
