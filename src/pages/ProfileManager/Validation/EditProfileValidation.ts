import * as Yup from 'yup';
import { EditProfileProps } from '../Edit/props';

export const editProfileInitialValues = (data: any): EditProfileProps => {
  return <EditProfileProps>{
    profileID: data?.profileID,
    profileName: data?.profileName,
    moduleInfo: data?.moduleInfo,
    id: data?.id,
    name: data?.name,
    status: data?.status,
  };
};

export const editProfileValidationSchema = Yup.object({
  profileID: Yup.number().required('Profile ID is required'),
  profileName: Yup.string().required('Profile Name is required'),
  moduleInfo: Yup.array()
    .of(
      Yup.object().shape({
        moduleId: Yup.number().required('Module ID is required'),
        permissionScore: Yup.number().required('Permission score is required'),
      })
    )
    .required('Module info is required'),
});
