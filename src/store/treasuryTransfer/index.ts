import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getTreasuryTransfer = createAsyncThunk('getTreasuryTransferReducer', async () => {
  return await CallApi({
    url: `/api/TreasuryTransfer/banklist`,
    method: 'GET',
  });
});

export const addTreasuryTransfer = createAsyncThunk('addTreasuryTransferReducer', async (data: any) => {
  return await CallApi({
    url: `/api/TreasuryTransfer/add`,
    method: 'POST',
    data,
  });
});

export const getTreasuryTransferSendMail = createAsyncThunk('getTreasuryTransferSendMailReducer', async () => {
  return await CallApi({
    url: `/api/TreasuryTransfer/sendemail`,
    method: 'GET',
  });
});

export const getTreasuryTransferReducer = createSliceModule('getTreasuryTransferReducer', getTreasuryTransfer).reducer;
