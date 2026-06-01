import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { Col, Form, Input, Row } from 'antd';
import CDataGrid from '../../../components/CDataGrid/Lazy';
import { getPermissionModules, getPermissionProfile, getProfileList, putPermission } from '../../../store/permissions';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import CErrorMessage from '../../../components/CErrorMessage';
import ButtonArea from '../../../components/ButtonArea';
import CCard from '../../../components/CCard';
import { EditGeneralFormProps, EditRoleDataType } from '../../../dbProps';
import { EditProfileProps } from './props';
import { editProfileInitialValues, editProfileValidationSchema } from '../Validation/EditProfileValidation';
import styles from './styles.module.scss';

const EditProfileForm: React.FC<EditGeneralFormProps> = ({ onClose, onFormReset, shouldResetForm, selectedRowData }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formikRef = useRef<FormikProps<EditProfileProps>>(null);
  const getPermissionModulesValue = useAppSelector((state) => state.getPermissionModulesValue?.data);
  const getProfileData = useAppSelector((state) => state.getPermissionProfileValue?.data?.data);
  const [, setUserInfo] = useState<any[]>([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<Record<string, boolean>>({});
  const [data, setData] = useState<EditRoleDataType[]>([]);

  const handleCheckboxChange = (checked: boolean, record: EditRoleDataType, columnName: string) => {
    setData((prevData) => {
      const updatedData = prevData?.map((item) =>
        item.key === record.key
          ? {
              ...item,
              [columnName]: checked,
            }
          : item
      );
      const updatedCheckboxes = {
        ...selectedCheckboxes,
        [`${record.key}-${columnName}`]: checked,
      };
      setSelectedCheckboxes(updatedCheckboxes);

      const modifiedUserType = updatedData.find((item) => item.key === record.key)?.moduleName;

      if (modifiedUserType) {
        if (columnName !== 'view' && !updatedCheckboxes[`${record.key}-view`]) {
          updatedData.forEach((item) => {
            if (item.key === record.key) {
              item.view = true;
              updatedCheckboxes[`${record.key}-view`] = true;
            }
          });
        }

        const module = updatedData.find((item) => item.key === record.key);
        if (module) {
          let newScore = 0;
          // Calculate score based on checked permissions
          if (module.view) newScore += 1;
          if (module.create) newScore += 2;
          if (module.edit) newScore += 3;
          if (module.delete) newScore += 4;

          // Special case handling
          if (newScore === 4) {
            // If score is 4, ensure only view and edit are checked
            module.view = true;
            module.create = false;
            module.edit = true;
            module.delete = false;
            updatedCheckboxes[`${record.key}-view`] = true;
            updatedCheckboxes[`${record.key}-create`] = false;
            updatedCheckboxes[`${record.key}-edit`] = true;
            updatedCheckboxes[`${record.key}-delete`] = false;
          } else if (newScore === 5) {
            // If score is 5, ensure only view and delete are checked
            module.view = true;
            module.create = false;
            module.edit = false;
            module.delete = true;
            updatedCheckboxes[`${record.key}-view`] = true;
            updatedCheckboxes[`${record.key}-create`] = false;
            updatedCheckboxes[`${record.key}-edit`] = false;
            updatedCheckboxes[`${record.key}-delete`] = true;
          }

          module.permissionScore = newScore;
        }
      }
      return updatedData;
    });
  };

  const convertPermissionScoreToCheckboxes = (score: number) => {
    // Special case for score 4 - only view and edit
    if (score === 4) {
      return {
        view: true,
        create: false,
        edit: true,
        delete: false,
      };
    }
    // Special case for score 5 - only view and delete
    if (score === 5) {
      return {
        view: true,
        create: false,
        edit: false,
        delete: true,
      };
    }
    // Special case for score 6 - only view,create,edit
    if (score === 6) {
      return {
        view: true,
        create: true,
        edit: true,
        delete: false,
      };
    }
    // Special case for score 7 - only view,create,delete
    if (score === 7) {
      return {
        view: true,
        create: true,
        edit: false,
        delete: true,
      };
    }
    // Special case for score 8 - view,edit,delete
    if (score === 8) {
      return {
        view: true,
        create: false,
        edit: true,
        delete: true,
      };
    }

    // Default case - view is always true if score > 0
    return {
      view: score > 0,
      create: score >= 3,
      edit: score >= 6,
      delete: score >= 10,
    };
  };

  const makeCheckboxCell = (colName: string, isViewCol = false) => (cellData: any) => {
    const record: EditRoleDataType = cellData.data;
    const isChecked = selectedCheckboxes[`${record.key}-${colName}`] ?? false;
    const isDisabled =
      isViewCol &&
      (selectedCheckboxes[`${record.key}-create`] || selectedCheckboxes[`${record.key}-edit`] || selectedCheckboxes[`${record.key}-delete`]);
    return (
      <input
        type='checkbox'
        checked={isChecked}
        disabled={isDisabled}
        onChange={(e) => handleCheckboxChange(e.target.checked, record, colName)}
        style={{ width: 16, height: 16, cursor: isDisabled ? 'not-allowed' : 'pointer', accentColor: '#1B3C73' }}
      />
    );
  };

  const columns = [
    { dataField: 'moduleName', caption: 'module_name', addition: { minWidth: 150 } },
    { dataField: 'view',   caption: 'view',   addition: { alignment: 'center' as const, width: 80 },  cellRender: makeCheckboxCell('view', true) },
    { dataField: 'create', caption: 'create', addition: { alignment: 'center' as const, width: 80 },  cellRender: makeCheckboxCell('create') },
    { dataField: 'edit',   caption: 'edit',   addition: { alignment: 'center' as const, width: 80 },  cellRender: makeCheckboxCell('edit') },
    { dataField: 'delete', caption: 'delete', addition: { alignment: 'center' as const, width: 80 },  cellRender: makeCheckboxCell('delete') },
  ];

  const submitHandler = async (formData: EditProfileProps) => {
    if (data) {
      const moduleInfo = data?.map((item) => {
        let score = 0;
        if (item.view) score += 1;
        if (item.create) score += 2;
        if (item.edit) score += 3;
        if (item.delete) score += 4;
        return {
          moduleId: Number(item.key),
          permissionScore: score,
        };
      });

      const requestPayload = {
        profileID: formData.profileID,
        profileName: formData.profileName,
        moduleInfo,
      };
      await dispatch(putPermission(requestPayload));
      await dispatch(getPermissionProfile(selectedRowData.id));
      await dispatch(getProfileList());
    }
    onClose();
    onFormReset();
  };

  useEffect(() => {
    const fetchApis = async () => {
      await dispatch(getPermissionModules());
      if (selectedRowData) {
        await dispatch(getPermissionProfile(selectedRowData.id));
      }
    };
    fetchApis();
  }, [selectedRowData.id]);

  useEffect(() => {
    const moduleList = Array.isArray(getPermissionModulesValue)
      ? getPermissionModulesValue
      : Array.isArray(getPermissionModulesValue?.data)
        ? getPermissionModulesValue.data
        : null;

    if (moduleList) {
      const modules = moduleList.map((item: { moduleId: number; moduleName: string }) => {
        const moduleInfo = getProfileData?.moduleInfo?.find((info: any) => info.moduleId === item.moduleId);
        const permissionScore = moduleInfo?.permissionScore || 0;
        const checkboxes = convertPermissionScoreToCheckboxes(permissionScore);

        return {
          key: String(item.moduleId),
          moduleName: t(item.moduleName),
          fieldKey: item.moduleName,
          ...checkboxes,
          permissionScore,
        };
      });
      const sortedModules = modules?.sort((a: EditRoleDataType, b: EditRoleDataType) => a.moduleName.localeCompare(b.moduleName));
      setData(sortedModules);

      const initialCheckboxes: Record<string, boolean> = {};
      modules.forEach((module: EditRoleDataType) => {
        initialCheckboxes[`${module.key}-view`] = module.view;
        initialCheckboxes[`${module.key}-create`] = module.create;
        initialCheckboxes[`${module.key}-edit`] = module.edit;
        initialCheckboxes[`${module.key}-delete`] = module.delete;
      });
      setSelectedCheckboxes(initialCheckboxes);
    }
  }, [getPermissionModulesValue, getProfileData]);

  useEffect(() => {
    if (shouldResetForm && formikRef.current) {
      formikRef.current.resetForm();
      onFormReset();
    }
  }, [shouldResetForm, onFormReset]);

  useEffect(() => {
    const userID = selectedRowData.id;

    const moduleDetail = Object.keys(data)?.map((key: any) => {
      const { key: moduleId, permissionScore } = data[key];
      return { moduleId, permissionScore };
    });

    const newObject = {
      profileID: userID,
      moduleInfo: moduleDetail,
    };
    const updatedUserInfo = [newObject];
    setUserInfo(updatedUserInfo);
  }, [selectedRowData, data]);

  return (
    <Formik
      key={Math.random()}
      innerRef={formikRef}
      initialValues={editProfileInitialValues(getProfileData)}
      validationSchema={editProfileValidationSchema}
      validateOnChange={true}
      onSubmit={submitHandler}
      validateOnBlur={true}>
      {({ values, errors, handleSubmit, setFieldValue }) => (
        <Form className={styles['c-edit-profile-form']} name='edit-profile' layout='vertical' onFinish={handleSubmit}>
          <CCard paddingOn className={styles['c-edit-profile-form__card']}>
            <Row align={'top'}>
              <Col span={12}>
                <Form.Item name='profileName' label={t('profile_name')}>
                  <>
                    <Input value={values?.profileName} type='text' onChange={(e) => setFieldValue('profileName', e.target.value)} />
                    <CErrorMessage errorMessage={errors.profileName} />
                  </>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <CDataGrid
                  gridKey='edit-profile-permissions'
                  stateStore='NO'
                  data={data}
                  columns={columns}
                  height='45vh'
                  editButtonVisible={false}
                  deleteButtonVisible={false}
                  addLogicVisible={false}
                  toolbarVisible={false}
                  paging={true}
                  pageSize={4}
                  allowSorting={false}
                />
              </Col>
            </Row>
          </CCard>
          <Row>
            <Col span={24}>
              <ButtonArea cancelClick={() => onClose()} submitTitle='Update' />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default EditProfileForm;
