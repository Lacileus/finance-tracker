'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import type { Expense } from '@/types/expense';
import { CATEGORIES } from '@/types/expense';
import { useExpenses } from '@/app/use-expenses';
import { useCategories } from '@/hooks/useCategories';
import { format } from 'date-fns';
import { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';

import { YSelect } from '@/shared/ui';

function groupByDate(expenses: Expense[]): { date: string; expenses: Expense[]; total: number }[] {
  const grouped = expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    const monthAndYear = `${format(expense.date, 'yyyy-MM')}`;
    if (!acc[monthAndYear]) {
      acc[monthAndYear] = [];
    }

    acc[monthAndYear].push(expense);
    return acc;
  }, {});

  const sortedByDate = Object.entries(grouped).sort(([dateA], [dateB]) =>
    dateB.localeCompare(dateA),
  );

  return sortedByDate.map(([date, items]) => {
    return {
      date: date,
      expenses: items,
      total: items.reduce((acc, item) => (acc += item.amount), 0),
    };
  });
}

function ExpensesContent() {
  const { expenses } = useExpenses();
  const { getLabel } = useCategories();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterCategory = searchParams.get('category') ?? 'all';

  const setFilterCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all') {
      params.delete('category');
    } else {
      params.set('category', value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const filtered =
    filterCategory === 'all' ? expenses : expenses.filter((e) => e.category === filterCategory);

  const grouped = groupByDate(filtered);

  return (
    <div className="p-6">
      <div className="mb-4">
        <YSelect
          className="w-48"
          value={filterCategory}
          onChange={setFilterCategory}
          options={[{ value: 'all', label: 'Все' }, ...CATEGORIES]}
        />
      </div>

      {expenses.length === 0 ? (
        <p>
          Расходов пока нет. <Link href="/add">Добавить первый</Link>
        </p>
      ) : filtered.length === 0 ? (
        <p>Нет расходов в категории «{getLabel(filterCategory)}».</p>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-4xl border-2 py-4">
          {grouped.map(({ date, expenses, total }) => (
            <Fragment key={date}>
              <h1>{date}</h1>
              <Table className="table-fixed">
                <colgroup>
                  <col className="w-40" />
                  <col className="w-50" />
                  <col />
                  <col className="w-30" />
                </colgroup>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Сумма ₽</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense, index) => (
                    <TableRow
                      className={['cursor-pointer border-0', index % 2 ? 'bg-card' : ''].join(' ')}
                      onClick={() => router.push(`/day/${expense.date}`)}
                      key={expense.id}
                    >
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell className="truncate">{expense.description}</TableCell>
                      <TableCell>{expense.amount}</TableCell>
                      {/* <TableCell>{expense.id}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter
                  className={
                    total > 30000
                      ? total > 40000
                        ? 'border-t-red-500 text-red-500'
                        : 'border-t-yellow-500 text-yellow-500'
                      : 'border-t-lime-600 text-lime-600'
                  }
                >
                  <TableRow>
                    <TableCell colSpan={3}>Итого</TableCell>
                    <TableCell>{total}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExpensesListPage() {
  return (
    <Suspense fallback={<p>Загрузка...</p>}>
      <ExpensesContent />
    </Suspense>
  );
}
