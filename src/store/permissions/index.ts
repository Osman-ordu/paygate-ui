import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

// Profile List => get profile list
export const getProfileList = createAsyncThunk('getProfileList', async () => {
  return await CallApi({
    url: `/api/Role`,
    method: 'GET',
  });
});

// Profile Add
export const addProfile = createAsyncThunk('addProfile', async (data: any) => {
  return await CallApi({
    url: `/api/Role`,
    method: 'POST',
    data: data,
  });
});

// Profile Edit
export const editProfile = createAsyncThunk('editProfile', async (data: any) => {
  return await CallApi({
    url: `/api/Role`,
    method: 'PUT',
    data: data,
  });
});

// Change status
export const changeStatusRole = createAsyncThunk('changeStatusRole', async ({ id }: any) => {
  return await CallApi({
    url: `/api/Role/changeStatus?roleId=${id}`,
    method: 'PUT',
  });
});

export const putPermission = createAsyncThunk('putPermission', async (data: any) => {
  return await CallApi({
    url: `/api/Permission`,
    method: 'PUT',
    data: data,
  });
});

export const getPermission = createAsyncThunk('permission', async () => {
  return await CallApi({
    url: '/api/Permission',
    method: 'GET',
  });
});

export const getPermissionModules = createAsyncThunk('permissionModules', async () => {
  return await CallApi({
    url: '/api/Permission/getmodules',
    method: 'GET',
  });
});

export const getPermissionProfile = createAsyncThunk('getPermissionProfile', async (profileId: any) => {
  return await CallApi({
    url: `/api/Permission/${profileId}`,
    method: 'GET',
  });
});

export const editProfileReducer = createSliceModule('editProfileReducer', editProfile).reducer;
export const getProfileListReducer = createSliceModule('getProfileListReducer', getProfileList).reducer;
export const addProfileReducer = createSliceModule('addProfileReducer', addProfile).reducer;
export const putPermissionReducer = createSliceModule('putPermissionSlice', putPermission).reducer;
export const getPermissionReducer = createSliceModule('permissionSlice', getPermission).reducer;
export const getPermissionModulesReducer = createSliceModule('permissionModulesSlice', getPermissionModules).reducer;
export const getPermissionProfileReducer = createSliceModule('getPermissionProfileReducer', getPermissionProfile).reducer;
export const changeStatusRoleReducer = createSliceModule('changeStatusRoleReducer', changeStatusRole).reducer;
