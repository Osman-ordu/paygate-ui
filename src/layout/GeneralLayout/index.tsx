import { useEffect } from 'react';
import i18n from '../../i18n/index';

export default function GeneralLayout({ children }: any) {
  useEffect(() => {
    const language = localStorage.getItem('language');

    if (language) {
      localStorage.setItem('language', language);
      i18n.changeLanguage(language);
    } else {
      localStorage.setItem('language', 'tr');
      i18n.changeLanguage('tr');
    }
  }, [i18n]);

  return children;
}
