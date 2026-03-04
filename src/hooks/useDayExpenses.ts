import { useMemo } from 'react';
import { useExpenses } from '@/app/use-expenses';

/*
  Доменный хук — инкапсулирует логику получения расходов за конкретный день.

  Раньше эта логика была размазана по компонентам:
    DayPage:     const dayExpenses = expenses.filter(e => e.date === date)
    CalendarPage: expenses.filter(e => e.date === date).reduce(...)

  Теперь логика в одном месте, компонент просто вызывает хук и рендерит данные.

  Почему useMemo здесь уместен:
  Хук может использоваться в компонентах с собственным state (например, CalendarPage
  с локальным фильтром). При каждом ре-рендере фильтр будет пересчитываться заново.
  useMemo гарантирует, что при том же date и expenses пересчёта не будет.
*/
export function useDayExpenses(date: string | undefined) {
  const { expenses } = useExpenses();

  const dayExpenses = useMemo(
    () => (date ? expenses.filter((e) => e.date === date) : []),
    [expenses, date],
  );

  const total = useMemo(() => dayExpenses.reduce((sum, e) => sum + e.amount, 0), [dayExpenses]);

  return { dayExpenses, total };
}
