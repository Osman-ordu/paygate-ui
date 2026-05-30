import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getQuickTransaction = createAsyncThunk('quickTransaction', async () => {
  return await CallApi({
    url: `/api/QuickTransaction`,
    method: 'GET',
  });
});

export const addQuickTransaction = createAsyncThunk('addQuickTransaction', async (params: any) => {
  return await CallApi({
    url: `/api/QuickTransaction`,
    method: 'POST',
    data: params,
  });
});

export const deleteQuickTransaction = createAsyncThunk('deleteQuickTransaction', async (id: any) => {
  return await CallApi({
    url: `/api/QuickTransaction/delete?id=${id}`,
    method: 'PUT',
  });
});

export const quickTransactionReducer = createSliceModule('quickTransactionSlice', getQuickTransaction).reducer;
export const addQuickTransactionReducer = createSliceModule('addQuickTransactionSlice', addQuickTransaction).reducer;
