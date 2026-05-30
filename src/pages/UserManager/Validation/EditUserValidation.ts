import * as Yup from 'yup';
import { EditUserProps } from '../../../dbProps';

export const EditUserInitialValue = (data: any): EditUserProps => {
  return <EditUserProps>{
    id: data.id,
    roleId: data.roleId,
    name: data.name,
    surname: data.surname,
    phoneNumber: data.phoneNumber,
    email: data.email,
  };
};

const requiredMessage = (fieldName: string) => `${fieldName} is required`;

export const EditUserValidationSchema = Yup.object().shape({
  name: Yup.string().required(requiredMessage('Name')),
  surname: Yup.string().required(requiredMessage('Surname')),
  email: Yup.string().required(requiredMessage('Email')).email('Invalid email address'),
  phoneNumber: Yup.string().required(requiredMessage('Phone')).min(11, 'Phone number must be 11 digits').max(11, 'Phone number must be 11 digits'),
  roleId: Yup.string().required(requiredMessage('Profile')),
});
