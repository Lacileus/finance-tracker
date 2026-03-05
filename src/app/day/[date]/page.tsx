'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useDayExpenses } from '@/hooks/useDayExpenses';
import { useCategories } from '@/hooks/useCategories';
import { useExpenses } from '@/app/use-expenses';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Fragment } from 'react/jsx-runtime';
import { ArrowLeftIcon } from 'lucide-react';

export default function DayPage({ params }: { params: Promise<{ date: string }> }) {
  const router = useRouter();
  const { removeExpense } = useExpenses();

  const { date } = use(params);

  // Вся логика фильтрации и подсчёта — в хуке.
  const { dayExpenses, total } = useDayExpenses(date);
  const { getLabel } = useCategories();

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="bg-card w-200 overflow-hidden rounded-3xl border-2">
        <div className="m-6 flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <Button className="w-30" size="sm" variant="ghost" onClick={() => router.back()}>
              <ArrowLeftIcon />
              <span className="text-lg">Назад</span>
            </Button>
            <h2>Расходы за {date}</h2>
            {dayExpenses.length === 0 && <p>В этот день расходов нет.</p>}
          </div>
          <Button className="cursor-pointer" size="lg" onClick={() => router.push(`/add/${date}`)}>
            <span className="text-lg">Добавить?</span>
          </Button>
        </div>

        {dayExpenses.length > 0 && (
          <Fragment>
            <p className="m-6">Итого: {total} ₽</p>
            <Table className="table-fixed">
              <colgroup>
                <col className="w-30" />
                <col className="w-35" />
                <col />
                <col className="w-30" />
              </colgroup>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Сумма ₽</TableHead>
                  <TableHead className="text-center">Категория</TableHead>
                  <TableHead className="text-center">Описание</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dayExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="text-center">{expense.amount}</TableCell>
                    <TableCell className="text-center">{getLabel(expense.category)}</TableCell>
                    <TableCell className="truncate text-center">{expense.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExpense({ id: expense.id })}
                      >
                        Удалить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Fragment>
        )}
      </div>
    </div>
  );
}
