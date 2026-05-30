import { useState } from 'react';
import styles from './styles.module.scss';

export default function DropDown({ icon, menu }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={styles['c-dropdown']}>
      <button className={styles['c-dropdown__toggle']} onClick={toggleDropdown}>
        {icon}
      </button>
      <input checked={isOpen} type='checkbox'></input>
      <ul className={styles['c-dropdown__menu']}>
        {menu?.map((item: any, index: any) => (
          <li className={styles['c-dropdown__menuItems']} key={index}>
            <div onClick={() => item.onClick()} className={styles['c-dropdown__menuItem']}>
              {item.icon}
              {item.label}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
