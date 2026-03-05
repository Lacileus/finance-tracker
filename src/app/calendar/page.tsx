'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import { useExpenses } from '@/app/use-expenses';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function CalendarPage() {
  const { expenses } = useExpenses();
  const router = useRouter();

  // Текущий отображаемый месяц. useState с начальным значением new Date() —
  // ленивая инициализация не нужна, Date() дёшев.
  const [currentDate, setcurrentDate] = useState(() => new Date());

  const totalByDate = useMemo(
    () =>
      expenses.reduce<Record<string, number>>((acc, e) => {
        acc[e.date] = (acc[e.date] ?? 0) + e.amount;
        return acc;
      }, {}),
    [expenses],
  );

  const totalByMonth = useMemo(() => {
    return expenses.reduce<Record<string, number>>((acc, e) => {
      const monthAndYear = format(e.date, 'yyyy-MM');
      acc[monthAndYear] = (acc[monthAndYear] ?? 0) + e.amount;
      return acc;
    }, {});
  }, [expenses]);

  /*
    eachDayOfInterval возвращает массив всех Date от start до end включительно.
    startOfMonth / endOfMonth — первый и последний день месяца.
  */
  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });
  }, [currentDate]);

  /*
    Сдвиг первого дня: сколько пустых ячеек перед 1-м числом.
    getDay() возвращает 0=воскресенье, 1=понедельник ... 6=суббота.
    Формула (getDay() + 6) % 7 конвертирует в 0=понедельник ... 6=воскресенье.
  */
  const startOffset = (getDay(days[0]) + 6) % 7;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setcurrentDate((m) => subMonths(m, 1));
      }
      if (e.key === 'ArrowRight') {
        setcurrentDate((m) => addMonths(m, 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="grid w-200 grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}

        {/* Пустые ячейки для выравнивания первого дня по дню недели */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const total = totalByDate[dateStr];
          const hasExpenses = total !== undefined;

          return (
            <div
              key={dateStr}
              className={[
                'relative flex aspect-square cursor-pointer items-center justify-center rounded-sm border-2',
                hasExpenses ? 'bg-card' : '',
                isToday(day) ? 'border-primary' : '',
              ].join(' ')}
              onClick={() => router.push(`/day/${dateStr}`)}
            >
              <span
                className={[
                  'absolute top-2 left-2',
                  isToday(day) ? 'text-primary' : 'text-accent',
                ].join(' ')}
              >
                {format(day, 'd')}
              </span>
              {hasExpenses && <span className=" ">{total}</span>}
            </div>
          );
        })}
      </div>
      <h1>Итого {totalByMonth[format(currentDate, 'yyyy-MM')] || 0} Р</h1>
      <div className="absolute bottom-4 flex items-center gap-4">
        <Button
          className="cursor-pointer"
          size="icon-lg"
          variant="outline"
          onClick={() => setcurrentDate((m) => subMonths(m, 1))}
        >
          <ArrowLeftIcon />
        </Button>
        <span className="text-accent">{format(currentDate, 'LLL yyyy')}</span>
        <Button
          className="cursor-pointer"
          size="icon-lg"
          variant="outline"
          onClick={() => setcurrentDate((m) => addMonths(m, 1))}
        >
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
