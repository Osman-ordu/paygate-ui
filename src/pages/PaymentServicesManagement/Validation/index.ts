import * as Yup from 'yup';

export interface EditWorkFrequencyModalProps {
  onFormReset: () => void;
  shouldResetForm: boolean;
  selectedRowData: any;
  onClose: () => void;
}

export const getInitialValues = (selectedRowData: any) => ({
  serviceName: selectedRowData?.serviceName,
  integrationType: selectedRowData?.integrationType,
  status: selectedRowData?.status,
  workFrequency: selectedRowData?.workFrequency,
  lastUpdateBy: selectedRowData?.lastUpdateBy,
  lastUpdateAt: selectedRowData?.lastUpdateAt,
});

export const getValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    workFrequency: Yup.string()
      .required(t('workFrequencyRequired'))
      .test('integer-format', t('integerError'), (value) => {
        if (!value) return true;
        return /^[1-9]\d*$/.test(value);
      })
      .test('min-value', 'mBGT2', (value) => {
        if (!value) return true;
        const num = parseInt(value);
        return num >= 60;
      })
      .test('max-value', t('workFrequencyMaxError'), (value) => {
        if (!value) return true;
        const num = parseInt(value);
        return num <= 999999;
      }),
  });
};
