export const columnChooserConfig = {
  searchEnabled: true,
  allowSelectAll: true,
  selectByClick: true,
  recursive: true,
} as const;

export const getTransactionStatusConfig = (t: (key: string) => string) => ({
  deposit: {
    0: { text: t('un_successful'), className: 'status-unsuccess' },
    1: { text: t('successful'), className: '' },
    2: { text: t('uncertain'), className: 'status-uncertain' },
    3: { text: t('stuck_at_masak'), className: 'status-pending' },
    4: { text: t('awaiting_approval'), className: '' },
    5: { text: t('rejected'), className: 'status-rejected' },
    6: { text: t('dual_registration'), className: 'status-rejected' },
    7: { text: t('potential_psp'), className: 'status-rejected' },
    8: { text: t('manually_completed'), className: '' },
    9: { text: t('manually_rejected'), className: 'status-rejected' },
  },
  withdrawal: {
    0: { text: t('un_successful'), className: 'status-unsuccess' },
    1: { text: t('successful'), className: '' },
    2: { text: t('waiting'), className: 'status-pending' },
    3: { text: t('sendingToChainup'), className: 'status-pending' },
    4: { text: t('rejectToChainup'), className: 'status-unsuccess' },
    5: { text: t('responseFromBank'), className: 'status-unsuccess' },
  },
});
