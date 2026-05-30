import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getBankData = createAsyncThunk('bank', async () => {
  return await CallApi({
    url: `/api/CompanyBank`,
    method: 'GET',
  });
});

export const bankReducer = createSliceModule('bankSlice', getBankData).reducer;
