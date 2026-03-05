import { format, getMonth, getYear } from 'date-fns';
import { fr } from 'date-fns/locale';

export function getCurrentMonth(): number {
  return getMonth(new Date()) + 1;
}

export function getCurrentYear(): number {
  return getYear(new Date());
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: fr });
}

export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

export function extractMonthYear(date: Date | string): { month: number; year: number } {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return {
    month: getMonth(dateObj) + 1,
    year: getYear(dateObj),
  };
}

export function getMonthName(month: number): string {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return months[month - 1] || '';
}
