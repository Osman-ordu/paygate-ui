import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getSeverHealthCheck = createAsyncThunk('getSeverHealthCheck', async () => {
  return await CallApi({
    url: `/api/ServerHealthCheck`,
    method: 'GET',
  });
});

export const healthCheckReducer = createSliceModule('healthCheckSlice', getSeverHealthCheck).reducer;
