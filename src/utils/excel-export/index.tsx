import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';

function getTransactionStatusText(status: number, t: (key: string) => string) {
  switch (status) {
    case 0:
      return t('un_successful');
    case 1:
      return t('successful');
    case 2:
      return t('uncertain');
    case 3:
      return t('stuck_at_masak');
    case 4:
      return t('awaiting_approval');
    case 5:
      return t('rejected');
    case 6:
      return t('dual_registration');
    case 7:
      return t('potential_psp');
    default:
      return t('successful');
  }
}

function formatTimestamp(value: any): string {
  if (!value) return '';

  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return value;
  }
}

export function datagridExcelExport(datagridComponent: any, fileName: string, pageType: string) {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Data Grid');

  exportDataGrid({
    component: datagridComponent.current.instance,
    worksheet,
    autoFilterEnabled: true,
    keepColumnWidths: true,
    customizeCell: (options: any) => {
      const { excelCell, gridCell } = options;
      excelCell.font = { name: 'Arial', size: 12 };
      excelCell.alignment = { horizontal: 'left' };
      if (pageType === 'deposit' && (gridCell.column?.dataField === 'refund' || gridCell.column?.dataField === '')) {
        excelCell.value = null;
        return;
      }

      if (gridCell.rowType === 'header') {
        excelCell.font = { name: 'Arial', size: 12, bold: true };
        worksheet.getColumn(excelCell.col).width = 25;
      }
      if (excelCell && typeof excelCell.value === 'string') {
        const cleanValue = excelCell.value.replace(/<[^>]+>/g, '');
        excelCell.value = cleanValue;
      }
    },
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
    });
  });
}

export function exportToExcel(pageType: string, data: any[], fileName: string, t: (key: string) => string) {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Data');

  const getColumnOrder = (pageType: string) => {
    switch (pageType) {
      case 'deposit':
        return [
          { key: 'id', translation: 'Id' },
          { key: 'uid', translation: t('uid') },
          { key: 'companyBankName', translation: t('incoming_account') },
          { key: 'depositDate', translation: t('transaction_date') },
          { key: 'receiptNo', translation: t('receipt_no') },
          { key: 'userBankName', translation: t('members_bank') },
          { key: 'iban', translation: t('iban') },
          { key: 'tckn', translation: t('tckn') },
          { key: 'amount', translation: t('amount') },
          { key: 'symbol', translation: t('currency') },
          { key: 'transactionStatus', translation: t('transaction_status') },
          { key: 'transactionNo', translation: t('transaction_no') },
          { key: 'depositDescriptionIade', translation: t('reason_cancelation') },
          { key: 'refundTransactionNo', translation: t('return_transaction_no') },
          { key: 'masakDecRequeired', translation: t('masak_notification') },
          { key: 'masakReport', translation: t('masak_notification_made') },
        ];
      case 'withdrawal':
        return [
          { key: 'uid', translation: t('uid') },
          { key: 'companyBankName', translation: t('send_account') },
          { key: 'withdrawDate', translation: t('transaction_date') },
          { key: 'recordId', translation: t('transaction_no') },
          { key: 'channel', translation: t('channel') },
          { key: 'bankName', translation: t('members_bank') },
          { key: 'iban', translation: t('iban') },
          { key: 'tckn', translation: t('tckn') },
          { key: 'amount', translation: t('amount') },
          { key: 'symbol', translation: t('currency') },
          { key: 'transactionStatus', translation: t('transaction_status') },
          { key: 'withdrawDescription', translation: t('reason_cancelation') },
        ];
      case 'transferList':
        return [
          { key: 'bankName', translation: t('bankName') },
          { key: 'stTransferDate', translation: t('stTransferDate') },
          { key: 'stTransactionNo', translation: t('stTransactionNo') },
          { key: 'stAmount', translation: t('stAmount') },
          { key: 'stTransferStatus', translation: t('stTransferStatus') },
          { key: 'stTransactionDescription', translation: t('reason') },
          { key: 'ttId', translation: t('ttId') },
          { key: 'ttTransferDate', translation: t('ttTransferDate') },
          { key: 'ttComment', translation: t('ttComment') },
          { key: 'ttBankName', translation: t('ttBankName') },
          { key: 'ttIban', translation: t('ttIban') },
          { key: 'ttFullName', translation: t('ttFullName') },
          { key: 'transferredBy', translation: t('transferedBy') },
          { key: 'transferType', translation: t('transferType') },
        ];
      case 'AutoTransfer':
        return [
          { key: 'timestamp', translation: t('timeStamp') },
          { key: 'depositAccount', translation: t('depositAccount') },
          { key: 'withdrawAccount', translation: t('withdrawalAccount') },
          { key: 'amount', translation: t('amount') },
          { key: 'status', translation: t('status') },
          { key: 'errorMessage', translation: t('errorMessage') },
        ];
      default:
        return Object.keys(data[0] || {})?.map((key) => ({
          key,
          translation: t(key),
        }));
    }
  };

  const columnOrder = getColumnOrder(pageType);
  worksheet.addRow(columnOrder?.map((col) => col.translation));
  data?.forEach((item) => {
    const row = columnOrder?.map((col) => {
      if (col.key === 'transactionStatus') {
        return getTransactionStatusText(item[col.key], t);
      }
      if (col.key === 'timestamp' && pageType === 'AutoTransfer') {
        return formatTimestamp(item[col.key]);
      }
      return item[col.key];
    });
    worksheet.addRow(row);
  });
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columnOrder.length },
  };
  worksheet.getRow(1).font = { bold: true };
  worksheet.columns?.forEach((column) => {
    column.width = 25;
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
  });
}

export function exportTreeListToExcel(treeListComponent: any, fileName: string) {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('LP Balance Data');

  const dataSource = treeListComponent.current.instance.option('dataSource');

  const headers = ['LP Name', 'Currency', 'Quantity', 'Balance (USDT)', 'Available Balance (USDT)'];
  worksheet.addRow(headers);

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  const processDataForExport = (data: any[], level = 0) => {
    data.forEach((item) => {
      if (item.id === 'account_CoinTr_Main') {
        const children = dataSource.filter((child: any) => child.parentId === item.id);
        if (children.length > 0) {
          processDataForExport(children, level + 1);
        }
        return;
      }
      let lpName = '';
      let currencyValue = '';
      const quantityValue = item.quantity ?? '';
      const balanceValue = item.balance ?? '';
      const availableValue = item.available ?? '';

      if (item.type === 'total' && item.id === 'total') {
        lpName = 'TOTAL';
      } else if (item.type === 'lp') {
        lpName = item.lpName || item.name || '';

        if ((item.id === 'lp_WhiteBit' || item.id === 'lp_CoinTr') && !item.currency) {
          currencyValue = 'Total';
        }
      } else if (item.type === 'coin' || item.type === 'account') {
        currencyValue = item.currency || '';

        if (item.parentId?.includes('CoinTr')) {
          lpName = 'CoinTr';
        } else if (item.parentId?.includes('WhiteBit')) {
          lpName = 'WhiteBit';
        }
      } else if (item.type === 'total') {
        lpName = item.lpName || '';
      }

      const row = worksheet.addRow([lpName, currencyValue, quantityValue, balanceValue, availableValue]);

      if (item.type === 'grandTotal') {
        row.font = { bold: true };
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2DCDB' } };
      } else if (item.type === 'total') {
        row.font = { bold: true };
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F8F8' } };
      } else if (item.type === 'lp') {
        row.font = { bold: true };
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F0F0' } };
      } else if (item.type === 'account') {
        row.font = { italic: true };
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F8F8' } };
      }

      row.getCell(1).font = { bold: true };

      if (currencyValue === 'Main' || currencyValue === 'Trade') {
        row.getCell(2).font = { bold: true };
        row.getCell(4).font = { bold: true };
        row.getCell(5).font = { bold: true };
      }

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      const children = dataSource.filter((child: any) => child.parentId === item.id);
      if (children.length > 0) {
        processDataForExport(children, level + 1);
      }
    });
  };

  const rootItems = dataSource.filter((item: any) => !item.parentId);
  processDataForExport(rootItems);

  worksheet.columns.forEach((column) => {
    column.width = 50;
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
  });
}
