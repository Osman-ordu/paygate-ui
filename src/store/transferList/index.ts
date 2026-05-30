import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getTransferList = createAsyncThunk('getTransferListReducer', async (params: any) => {
  if (params === 'allDate') {
    return await CallApi({
      url: `/api/SubTransfer/getall`,
      method: 'GET',
    });
  } else {
    return await CallApi({
      url: `/api/SubTransfer`,
      method: 'GET',
      params,
    });
  }
});

export const getTransferListAccount = createAsyncThunk('getTransferListAccountReducer', async () => {
  return await CallApi({
    url: `/api/TreasuryTransfer/accounts`,
    method: 'GET',
  });
});

export const addManualTransfer = createAsyncThunk('addManualTransferReducer', async (data: any) => {
  return await CallApi({
    url: `/api/TreasuryTransfer/addmanual`,
    method: 'POST',
    data,
  });
});

export const getTransferListReducer = createSliceModule('getTransferListReducer', getTransferList).reducer;
export const getTransferListAccountReducer = createSliceModule('getTransferListAccountReducer', getTransferListAccount).reducer;
