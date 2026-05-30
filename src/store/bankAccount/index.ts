import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getBankAccount = createAsyncThunk('bankAccount', async () => {
  return await CallApi({
    url: `/api/BankAccount`,
    method: 'GET',
  });
});

export const addBankAccount = createAsyncThunk('addBankAccount', async (params: any) => {
  return await CallApi({
    url: `/api/BankAccount`,
    method: 'POST',
    data: params,
  });
});

export const editBankAccount = createAsyncThunk('editBankAccount', async (data: any) => {
  return await CallApi({
    url: `/api/BankAccount`,
    method: 'PUT',
    data: data,
  });
});

export const bankAccountReducer = createSliceModule('bankAccountSlice', getBankAccount).reducer;
