import { IbanCellProps } from '../../dbProps';
import { formatterIban, formatterAmount } from '../general';
import styles from './styles.module.scss';

export const renderCellIban = ({ value }: IbanCellProps) => {
  const iban = formatterIban(value);

  return (
    <div title={iban} className={styles['iban-cell']}>
      {iban}
    </div>
  );
};

export const renderCellAmount = (rowData: any) => {
  return formatterAmount(rowData.data.amount);
};
