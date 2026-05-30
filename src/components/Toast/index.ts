import { toast } from 'react-toastify';
export const toastSuccess = (text: string) => {
  return toast.success(text ?? 'Connection Successful', { autoClose: 1000, theme: 'dark' });
};
export const toastError = (text: string) => {
  return toast.error(text ?? 'Connection Unsuccessful', { autoClose: 1000, theme: 'dark' });
};
export const toastInfo = (text: any) => {
  return toast.info(text ?? 'Info Area', { autoClose: 3000, theme: 'dark' });
};
export const toastWarning = (text?: string) => {
  return toast.warning(text ?? 'Warning', { autoClose: 4000, theme: 'dark' });
};
