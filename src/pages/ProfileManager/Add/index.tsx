import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { useAppDispatch } from '../../../store/hooks';
import { addProfile, getProfileList } from '../../../store/permissions';
import { Form, Input } from 'antd';
import CCard from '../../../components/CCard';
import CErrorMessage from '../../../components/CErrorMessage';
import ButtonArea from '../../../components/ButtonArea';
import { AddProfileProps } from './props';
import { addProfileInitialValue, addProfileValidationSchema } from '../Validation/AddProfileValidation';

interface AddProfileFormProps {
  onClose: () => void;
  onFormReset: any;
  shouldResetForm: any;
}

const AddProfileForm: React.FC<AddProfileFormProps> = ({ onClose, onFormReset, shouldResetForm }) => {
  const formikRef = useRef<FormikProps<AddProfileProps>>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const submitHandler = async (data: AddProfileProps, { resetForm }: any) => {
    if (data) {
      await dispatch(
        addProfile({
          name: data.profileName,
        })
      );
      await dispatch(getProfileList());
    }
    resetForm();
    onFormReset();
    onClose();
  };

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  return (
    <Formik innerRef={formikRef} initialValues={addProfileInitialValue()} validationSchema={addProfileValidationSchema} validateOnChange={true} onSubmit={submitHandler} validateOnBlur={true}>
      {({ values, setFieldValue, errors, handleSubmit }) => (
        <Form name='add-profile' layout='vertical' onFinish={handleSubmit}>
          <CCard paddingOn>
            <Form.Item name='profileName' label={t('profile_name')}>
              <>
                <Input value={values.profileName} onChange={(event) => setFieldValue('profileName', event.target.value)} type='text' placeholder={t('profile_name')} />
                <CErrorMessage errorMessage={errors.profileName} />
              </>
            </Form.Item>
          </CCard>
          <ButtonArea cancelClick={() => onClose()} />
        </Form>
      )}
    </Formik>
  );
};

export default AddProfileForm;
