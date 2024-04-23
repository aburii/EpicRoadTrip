import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

export function useFormatDate() {
  return (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    const { locale } = useI18n();
    return format(date, 'd MMM, yyy', { locale: locale.value === 'fr' ? fr : enUS });
  };
}
