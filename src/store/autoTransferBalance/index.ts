import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getAutoTransferBalance = createAsyncThunk('autoTransferBalance', async () => {
  return await CallApi({
    url: `/api/AutoTransfer`,
    method: 'GET',
  });
});

export const getTransactionLogs = createAsyncThunk('transactionLogs', async () => {
  return await CallApi({
    url: `/api/AutoTransfer/getTransactions`,
    method: 'GET',
  });
});

export const changeStatusAutoTransferBalance = createAsyncThunk('changeStatusAutoTransferBalance', async (id: any) => {
  return await CallApi({
    url: `/api/AutoTransfer/changestatus/${id}`,
    method: 'PUT',
  });
});

export const editAutoTransferBalance = createAsyncThunk('editAutoTransferBalance', async (data: any) => {
  return await CallApi({
    url: `/api/AutoTransfer`,
    method: 'PUT',
    data,
  });
});

export const addAutoTransferBalance = createAsyncThunk('addAutoTransferBalance', async (data: any) => {
  return await CallApi({
    url: `/api/AutoTransfer`,
    method: 'POST',
    data,
  });
});

export const deleteAutoTransfer = createAsyncThunk('changeStatusAutoTransferBalance', async (id: any) => {
  return await CallApi({
    url: `/api/AutoTransfer/${id}`,
    method: 'DELETE',
  });
});

export const autoTransferBalanceReducer = createSliceModule('autoTransferBalanceSlice', getAutoTransferBalance).reducer;
export const transactionLogsReducer = createSliceModule('transactionLogsSlice', getTransactionLogs).reducer;
