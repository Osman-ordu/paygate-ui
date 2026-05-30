import * as Yup from 'yup';
import { AddUserProps } from '../../../dbProps';

export const addUserInitialValue = (): AddUserProps => {
  return <AddUserProps>{
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    roleId: undefined,
    isActive: true,
    profile: null,
  };
};

const requiredMessage = (fieldName: string) => `${fieldName} is required`;

export const addUserValidationSchema = Yup.object().shape({
  name: Yup.string().required(requiredMessage('Name')),
  surname: Yup.string().required(requiredMessage('Surname')),
  email: Yup.string().required(requiredMessage('Email')),
  phone: Yup.string().required(requiredMessage('Phone')).min(11, 'Phone number must be 11 digits').max(11, 'Phone number must be 11 digits'),
  password: Yup.string().required(requiredMessage('Password')),
  profile: Yup.string().required(requiredMessage('Profile')),
});
