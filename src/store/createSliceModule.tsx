import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface initailStateType {
  data: any;
  isLoading: boolean;
  isError: string | boolean | null;
}

const initialState: initailStateType = {
  data: [],
  isLoading: false,
  isError: false,
};

export const createSliceModule = (name: any, data: any) =>
  createSlice({
    name: name,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(data.pending, (state) => {
        state.isLoading = true;
      });
      builder.addCase(data.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      });
      builder.addCase(data.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.data = [];
      });
    },
  });
