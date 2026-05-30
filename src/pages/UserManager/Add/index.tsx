import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, Row, Select } from 'antd';
import { Formik, FormikProps } from 'formik';
import { getProfileList } from '../../../store/permissions';
import { addUser } from '../../../store/userManager';
import { getUserData } from '../../../store/user';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { AddUserFormProps, AddUserProps } from '../../../dbProps';
import CCard from '../../../components/CCard';
import ButtonArea from '../../../components/ButtonArea';
import CErrorMessage from '../../../components/CErrorMessage';
import { addUserInitialValue, addUserValidationSchema } from '../Validation/AddUserValidation';

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose, onFormReset, shouldResetForm }) => {
  const formikRef = useRef<FormikProps<AddUserProps>>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const profileList = useAppSelector((state) => state.getProfileListValue?.data?.data);

  const profileEnum = profileList?.map((member: any) => ({
    value: member.id,
    label: member.name,
  }));

  const submitHandler = async (data: AddUserProps, { resetForm }: any) => {
    if (data) {
      const formattedPhone = data.phone.replace(/[^0-9]/g, '');
      await dispatch(
        addUser({
          name: data.name,
          surname: data.surname,
          email: data.email,
          phoneNumber: formattedPhone,
          password: data.password,
          roleId: data.profile,
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
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  return (
    <Formik
      key={Math.random()}
      innerRef={formikRef}
      initialValues={addUserInitialValue()}
      validationSchema={addUserValidationSchema}
      validateOnChange={true}
      onSubmit={submitHandler}
      validateOnBlur={true}>
      {({ values, setFieldValue, errors, handleSubmit }) => {
        return (
          <Form name='add-user' layout='vertical' onFinish={handleSubmit}>
            <CCard paddingOn>
              <Row align={'top'} gutter={36}>
                <Col span={12}>
                  <Form.Item name='name' label={t('name')}>
                    <>
                      <Input value={values?.name} onChange={(event) => setFieldValue('name', event.target.value)} type='text' placeholder={t('name')} />
                      <CErrorMessage errorMessage={errors?.name} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='surname' label={t('surname')}>
                    <>
                      <Input value={values?.surname} onChange={(event) => setFieldValue('surname', event.target.value)} type='text' placeholder={t('surname')} />
                      <CErrorMessage errorMessage={errors?.surname} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='phone' label={t('phone')}>
                    <>
                      <Input
                        value={values?.phone}
                        onChange={(event) => {
                          const value = event.target.value.replace(/[^0-9]/g, '');
                          setFieldValue('phone', value);
                        }}
                        type='tel'
                        placeholder='0-(555)-555-5555'
                        maxLength={11}
                      />
                      <CErrorMessage errorMessage={errors?.phone} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='email' label={t('email')}>
                    <>
                      <Input value={values?.email} onChange={(event) => setFieldValue('email', event.target.value)} type='email' placeholder='example@example.com' />
                      <CErrorMessage errorMessage={errors?.email} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='profile' label={t('profile')}>
                    <>
                      <Select value={values?.profile} onChange={(value) => setFieldValue('profile', value)} placeholder={t('select_profile_message')} options={profileEnum ?? []} />
                      <CErrorMessage errorMessage={errors?.profile} />
                    </>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='password' label={t('password')}>
                    <>
                      <Input value={values?.password} onChange={(event) => setFieldValue('password', event.target.value)} type='password' placeholder={t('password')} />
                      <CErrorMessage errorMessage={errors?.password} />
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
        );
      }}
    </Formik>
  );
};

export default AddUserForm;
