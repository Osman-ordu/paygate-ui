import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, Row } from 'antd';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../store/hooks';
import { updateIntegrationData, getIntegration } from '../../../store/integration';
import { PASSWORD_FIELD_VALUES, PasswordFields } from '../../../db/Enums';
import { banksColumns, exchangeColumns, lpsColumns } from '../../../db/Columns';
import { FormFieldConfig, EditBankCredentialsProps, IntegrationEditFormProps } from '../../../dbProps';
import CCard from '../../../components/CCard';
import ButtonArea from '../../../components/ButtonArea';
import { toastError } from '../../../components/Toast';

export default function IntegrationEdit({ onClose, onFormReset, shouldResetForm, selectedRowData, integrationType }: IntegrationEditFormProps) {
  const dispatch = useAppDispatch();
  const formikRef = useRef<FormikProps<EditBankCredentialsProps>>(null);
  const { t } = useTranslation();

  const getTypeFromRowData = (): string => {
    return selectedRowData?.type || '';
  };

  const getColumnConfig = (): FormFieldConfig[] => {
    const columnMap: Record<string, any[]> = {
      BANKS: banksColumns,
      EXCHANGE: exchangeColumns,
      LPS: lpsColumns,
    };

    const columns = columnMap[integrationType] || [];

    return columns
      ?.filter((col) => col.dataField !== 'type')
      ?.map((col) => ({
        dataField: col.dataField,
        caption: col.caption,
        dataType: col.dataType,
        required: false,
        label: col.caption,
      }));
  };

  const createValidationSchema = () => {
    const columns = getColumnConfig();
    const validationFields: any = {};

    columns?.forEach((column) => {
      if (column.required) {
        validationFields[column.dataField] = Yup.string().required(`${column.caption} is required`);
      } else {
        validationFields[column.dataField] = Yup.string();
      }
    });

    return Yup.object().shape(validationFields);
  };

  const getInitialValues = (): EditBankCredentialsProps => {
    if (!selectedRowData) {
      return {} as EditBankCredentialsProps;
    }

    const initialValues: any = {};
    const columns = getColumnConfig();

    columns?.forEach((column) => {
      initialValues[column.dataField] = selectedRowData[column.dataField] || '';
    });

    return initialValues as EditBankCredentialsProps;
  };

  const submitHandler = async (data: EditBankCredentialsProps) => {
    const currentType = getTypeFromRowData();
    const submitData: any = {
      type: currentType,
      userName: integrationType === 'BANKS' ? data.userName : data.apiKey || '',
      password: integrationType === 'BANKS' ? data.password : data.secretKey || '',
      apiUrl: data.apiUrl || '',
      accountNo: data.accountNo || '',
      tosUserName: data.tosUserName || '',
      tosPassword: integrationType === 'BANKS' ? data.tosPassword : data.passPhrase || '',
      secondApiUrl: data.secondApiUrl || '',
      customerNo: data.customerNo || '',
    };
    try {
      await dispatch(updateIntegrationData({ ...submitData, type: currentType }));
      await dispatch(getIntegration(integrationType));
      onClose();
    } catch (error) {
      toastError(error as string);
    }
  };

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  const columns = getColumnConfig();

  return (
    <Formik innerRef={formikRef} initialValues={getInitialValues()} validationSchema={createValidationSchema()} onSubmit={submitHandler} enableReinitialize>
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => {
        return (
          <Form layout='vertical' onFinish={handleSubmit}>
            <CCard paddingOn>
              <Row gutter={[16, 16]}>
                {columns?.map((column) => {
                  const isPasswordField = PASSWORD_FIELD_VALUES.includes(column.dataField as PasswordFields);
                  const formTouched = touched[column.dataField as keyof typeof touched];
                  const formError = errors[column.dataField as keyof typeof errors];
                  const fieldValue = values[column.dataField as keyof EditBankCredentialsProps];
                  const isEmpty = !fieldValue || fieldValue.toString().trim() === '';

                  return (
                    <Col span={12} key={column.dataField}>
                      <Form.Item label={t(column.label ?? column.caption)} validateStatus={formTouched && formError ? 'error' : ''} help={formTouched && formError ? String(formError) : ''}>
                        {isPasswordField ? (
                          <Input.Password
                            name={column.dataField}
                            value={fieldValue}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={`Enter ${t(column.label ?? column.caption)}`}
                            disabled={isEmpty}
                          />
                        ) : (
                          <Input name={column.dataField} value={fieldValue} onChange={handleChange} onBlur={handleBlur} placeholder={`Enter ${t(column.label ?? column.caption)}`} disabled={isEmpty} />
                        )}
                      </Form.Item>
                    </Col>
                  );
                })}
              </Row>
            </CCard>
            <ButtonArea onCancel={onClose} onSubmit={handleSubmit} cancelText={t('cancel')} submitText={t('update')} />
          </Form>
        );
      }}
    </Formik>
  );
}
