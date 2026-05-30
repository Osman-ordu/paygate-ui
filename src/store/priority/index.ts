import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getPriorities = createAsyncThunk('priorities', async () => {
  return await CallApi({
    url: `/api/BankAccount/priorities`,
    method: 'GET',
  });
});

export const prioritiesReducer = createSliceModule('prioritiesSlice', getPriorities).reducer;
