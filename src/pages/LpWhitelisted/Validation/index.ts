import * as Yup from 'yup';
import { channelEnum, entityEnum, senderLpEnum, targetTypeEnum } from '../../../db/Enums';
export interface IWhiteListedType {
  accountName: string;
  lpName: any;
  currencyOfTheAccount: string | undefined;
  walletAddress: string;
  network: string | undefined;
  memoTag: string;
  channel: string | number | null;
  vaspName: string | null;
  targetType: any | undefined;
  innerToType: string | undefined;
  entity: string | number | null;
  name: string;
  surname: string;
  birthdate: string;
  corporateName: string;
  corporateAddress: string;
  country: string | number | null;
  city: string | null;
  district: string | null;
  streetName: string | null;
  description: string | null;
}

export const addInitialValue = (): IWhiteListedType => {
  return {
    accountName: '',
    lpName: null,
    currencyOfTheAccount: undefined,
    walletAddress: '',
    network: undefined,
    memoTag: '',
    channel: null,
    vaspName: null,
    targetType: undefined,
    innerToType: undefined,
    entity: null,
    name: '',
    surname: '',
    birthdate: '',
    corporateName: '',
    corporateAddress: '',
    country: 'TR', // Turkey default
    city: '',
    district: '',
    streetName: '',
    description: '',
  };
};

export const editInitialValues = (data: any) => {
  const enumIds = {
    lpName: senderLpEnum?.find((item: any) => item.label.toLowerCase() === data.lpName.toLowerCase())?.value,
    channel: channelEnum?.find((item: any) => item.label.toLowerCase() === data.channel.toLowerCase())?.value,
    entity: entityEnum?.find((item: any) => item.label.toLowerCase() === data.entity.toLowerCase())?.value,
    targetType: targetTypeEnum?.find((item: any) => item.label.toLowerCase() === data.targetType.toLowerCase())?.value,
  };
  return <any>{
    accountName: data.accountName,
    lpName: enumIds.lpName,
    currencyOfTheAccount: data.currency,
    walletAddress: data.walletAddress,
    network: data.network,
    memoTag: data.memoTag,
    channel: enumIds.channel,
    vaspName: data.vaspName,
    targetType: enumIds.targetType,
    innerToType: data.innerToType,
    entity: enumIds.entity,
    name: data.name,
    surname: data.surname,
    birthdate: data.birthdate,
    corporateName: data.corporateName,
    corporateAddress: data.corporateAddress,
    country: data.country || null,
    city: data.city || null,
    district: data.district || null,
    streetName: data.streetName || null,
    description: data.description,
  };
};

export const validationSchema = Yup.object({
  accountName: Yup.string().required('accountName'),
  lpName: Yup.string().required('lpName'),
  currencyOfTheAccount: Yup.string().required('currencyOfTheAccount'),
  walletAddress: Yup.string().required('walletAddress'),
  network: Yup.string().required('network'),
  memoTag: Yup.string().nullable(),
  channel: Yup.number().required('channel'),
  vaspName: Yup.string().when('channel', {
    is: 0, // VASP
    then: (schema) => schema.required('vaspName'),
    otherwise: (schema) => schema.nullable(),
  }),
  targetType: Yup.string().required('targetType'),
  innerToType: Yup.string().when(['lpName', 'targetType'], {
    is: (lpName: any, targetType: any) => lpName == 2 && targetType == 2,
    then: (schema) => schema.required('innerToType'),
    otherwise: (schema) => schema.nullable(),
  }),
  entity: Yup.number().required('entity'),
  name: Yup.string().when('entity', {
    is: 0, // Personal
    then: (schema) => schema.required('name'),
    otherwise: (schema) => schema.nullable(),
  }),
  surname: Yup.string().when('entity', {
    is: 0, // Personal
    then: (schema) => schema.required('surname'),
    otherwise: (schema) => schema.nullable(),
  }),
  birthdate: Yup.string().when('entity', {
    is: 0, // Personal
    then: (schema) => schema.required('birthdate'),
    otherwise: (schema) => schema.nullable(),
  }),
  corporateName: Yup.string().when('entity', {
    is: 1, // Corporate
    then: (schema) => schema.required('corporateName'),
    otherwise: (schema) => schema.nullable(),
  }),
  corporateAddress: Yup.string().when('entity', {
    is: 1, // Corporate
    then: (schema) => schema.required('corporateAddress'),
    otherwise: (schema) => schema.nullable(),
  }),
  country: Yup.string().when('lpName', {
    is: (lpName: any) => lpName === 3 || lpName === 'OKX', // OKX (ID: 3 or name: 'OKX')
    then: (schema) => schema.required('country'),
    otherwise: (schema) => schema.nullable(),
  }),
  city: Yup.string().when('lpName', {
    is: (lpName: any) => lpName === 3 || lpName === 'OKX', // OKX (ID: 3 or name: 'OKX')
    then: (schema) => schema.required('city'),
    otherwise: (schema) => schema.nullable(),
  }),
  district: Yup.string().when('lpName', {
    is: (lpName: any) => lpName === 3 || lpName === 'OKX', // OKX (ID: 3 or name: 'OKX')
    then: (schema) => schema.required('district'),
    otherwise: (schema) => schema.nullable(),
  }),
  streetName: Yup.string().when('lpName', {
    is: (lpName: any) => lpName === 3 || lpName === 'OKX', // OKX (ID: 3 or name: 'OKX')
    then: (schema) => schema.required('streetName'),
    otherwise: (schema) => schema.nullable(),
  }),
  description: Yup.string()
    .required('description')
    .min(50, 'description_min_50')
    .matches(/^[^\s]+$/, 'description_no_spaces'),
});
