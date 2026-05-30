import * as Yup from 'yup';
import { AddProfileProps } from '../Add/props';

export const addProfileInitialValue = (): AddProfileProps => {
  return <AddProfileProps>{
    profileName: '',
  };
};

export const addProfileValidationSchema = Yup.object({
  profileName: Yup.string().required('Profile Name is required'),
});
