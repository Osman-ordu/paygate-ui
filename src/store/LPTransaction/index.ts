import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const postLPTransactionCurrencies = createAsyncThunk('postLPTransactionCurrencies', async (params: { lpNameId: number }) => {
  return await CallApi({
    url: `/api/LPTransaction/currencies`,
    method: 'POST',
    data: params,
  });
});

export const postLPTransactionNetworks = createAsyncThunk('postLPTransactionNetworks', async (params: { lpNameId: number; currencyName: string }) => {
  return await CallApi({
    url: `/api/LPTransaction/networks`,
    method: 'POST',
    data: params,
  });
});

export const addLpTransaction = createAsyncThunk('addLpTransaction', async (params: any) => {
  return await CallApi({
    url: `/api/LPTransaction`,
    method: 'POST',
    data: params,
  });
});

export const getLpWhitelistId = createAsyncThunk('getLpWhitelistId', async (id: any) => {
  return await CallApi({
    url: `/api/LPWhitelist/${id}`,
    method: 'GET',
  });
});

export const postLPTransactionCurrenciesReducer = createSliceModule('postLPTransactionCurrenciesSlice', postLPTransactionCurrencies).reducer;
export const postLPTransactionNetworksReducer = createSliceModule('postLPTransactionNetworksSlice', postLPTransactionNetworks).reducer;
export const getLpWhitelistIdReducer = createSliceModule('getLpWhitelistIdSlice', getLpWhitelistId).reducer;
