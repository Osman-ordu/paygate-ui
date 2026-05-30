import { useEffect, useRef } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getProfileList } from '../../../store/permissions';
import { getUserData } from '../../../store/user';
import { editUser } from '../../../store/userManager';
import { EditGeneralFormProps, EditUserProps } from '../../../dbProps';
import CCard from '../../../components/CCard';
import ButtonArea from '../../../components/ButtonArea';
import CErrorMessage from '../../../components/CErrorMessage';
import { EditUserInitialValue, EditUserValidationSchema } from '../Validation/EditUserValidation';

const EditUserForm: React.FC<EditGeneralFormProps> = ({ selectedRowData, onClose, onFormReset, shouldResetForm }) => {
  const formikRef = useRef<FormikProps<EditUserProps>>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const profileList = useAppSelector((state) => state.getProfileListValue?.data?.data);

  const profileEnum = profileList?.map((member: any) => ({
    value: member.id,
    label: member.name,
  }));

  const submitHandler = async (data: EditUserProps, { resetForm }: any) => {
    if (data) {
      await dispatch(
        editUser({
          id: data.id,
          name: data.name,
          surname: data.surname,
          phoneNumber: data.phoneNumber,
          email: data.email,
          roleId: data.roleId,
        })
      );
    }
    await dispatch(getUserData());
    resetForm();
    onFormReset();
    onClose();
  };

  useEffect(() => {
    const fetchApi = async () => {
      await dispatch(getProfileList());
    };
    fetchApi();
  }, [dispatch]);

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      formikRef.current.setValues(EditUserInitialValue(selectedRowData));
      onFormReset();
    }
  }, [shouldResetForm, selectedRowData, onFormReset]);

  return (
    <Formik
      key={Math.random()}
      innerRef={formikRef}
      initialValues={EditUserInitialValue(selectedRowData)}
      validationSchema={EditUserValidationSchema}
      validateOnChange={true}
      onSubmit={submitHandler}
      validateOnBlur={true}>
      {({ values, setFieldValue, errors, handleSubmit }) => (
        <Form name='edit-user' layout='vertical' onFinish={handleSubmit}>
          <CCard paddingOn>
            <Row align={'top'} gutter={36}>
              <Col span={12}>
                <Form.Item name='name' label={t('name')}>
                  <>
                    <Input value={values.name} onChange={(event) => setFieldValue('name', event.target.value)} type='text' placeholder={t('name')} />
                    <CErrorMessage errorMessage={errors.name} />
                  </>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='surname' label={t('surname')}>
                  <>
                    <Input value={values.surname} onChange={(event) => setFieldValue('surname', event.target.value)} type='text' placeholder={t('surname')} />
                    <CErrorMessage errorMessage={errors.surname} />
                  </>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='phoneNumber' label={t('phone')}>
                  <>
                    <Input
                      value={values.phoneNumber}
                      onChange={(event) => {
                        const value = event.target.value.replace(/[^0-9]/g, '');
                        setFieldValue('phoneNumber', value);
                      }}
                      type='tel'
                      placeholder='0-(555)-555-5555'
                      maxLength={11}
                    />
                    <CErrorMessage errorMessage={errors.phoneNumber} />
                  </>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='email' label={t('email')}>
                  <>
                    <Input value={values.email} onChange={(event) => setFieldValue('email', event.target.value)} type='email' placeholder='example@example.com' />
                    <CErrorMessage errorMessage={errors.email} />
                  </>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='profile' label={t('profile')}>
                  <>
                    <Select value={values?.roleId} onChange={(value) => setFieldValue('roleId', value)} placeholder={t('select_profile_message')} options={profileEnum ?? []} />
                    <CErrorMessage errorMessage={errors?.roleId} />
                  </>
                </Form.Item>
              </Col>
            </Row>
          </CCard>
          <Row>
            <Col span={24}>
              <ButtonArea cancelClick={() => onClose()} />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default EditUserForm;
