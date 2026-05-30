import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getIntegrationData = createAsyncThunk('integration', async () => {
  return await CallApi({
    url: `/api/Setting/credentials`,
    method: 'GET',
  });
});

export const getIntegration = createAsyncThunk('integration', async (type: string) => {
  return await CallApi({
    url: `/api/Setting/credentials?type=${type}`,
    method: 'GET',
  });
});

export const updateIntegrationData = createAsyncThunk('updateIntegration', async (data: any) => {
  return await CallApi({
    url: `/api/Setting/credentials`,
    method: 'PUT',
    data: {
      ...data,
      AccountNo: data?.type === 'ChainUpCredentials' ? '' : data?.AccountNo,
      RealSenderName: data?.type === 'ChainUpCredentials' ? '' : data?.RealSenderName,
    },
  });
});

export const integrationReducer = createSliceModule('integrationSlice', getIntegrationData).reducer;
export const getIntegrationReducer = createSliceModule('getIntegrationReducer', getIntegration).reducer;
