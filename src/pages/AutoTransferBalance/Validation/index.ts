import * as Yup from 'yup';

export const addInitialValue = (): any => {
  return <any>{
    withdrawalAccount: undefined,
    depositAccount: undefined,
    topUpBalance: 0,
    maintenanceBalance: 0,
    prioritization: 0,
  };
};

export const editInitialValues = (data: any) => {
  return <any>{
    withdrawalAccount: data.withdrawAccount,
    depositAccount: data.depositAccount,
    topUpBalance: data.topUpBalance,
    maintenanceBalance: data.maintenanceBalance,
    prioritization: data.prioritization,
  };
};

export const validationSchema = Yup.object({
  withdrawalAccount: Yup.string().required('withdrawalAccount'),
  depositAccount: Yup.string().required('depositAccount'),
  topUpBalance: Yup.number()
    .required('topUpBalance')
    .test('is-greater', 'Top-Up Balance must be greater than Maintenance Balance', function (value) {
      const { maintenanceBalance } = this.parent;
      if (typeof value === 'number' && typeof maintenanceBalance === 'number') {
        return value > maintenanceBalance;
      }
      return true;
    }),
  maintenanceBalance: Yup.number().required('maintenanceBalance'),
  prioritization: Yup.number().required('prioritization'),
});
