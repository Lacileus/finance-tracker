'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/types/expense';
import { useExpenses } from '@/app/use-expenses';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { YSelect } from '@/shared/ui';
import { YDatePicker } from '@/shared/ui/YDatePicker';
import { Button } from '@/components/ui/button';

export default function AddExpensePage({ params }: { params: Promise<{ date: string }> }) {
  const { addExpense } = useExpenses();

  const router = useRouter();

  const { date } = use(params);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [description, setDescription] = useState('');
  const [currentDate, setCurrentDate] = useState(() => {
    if (date) {
      return date;
    } else {
      return new Date().toISOString().slice(0, 10);
    }
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    addExpense({
      id: crypto.randomUUID(),
      amount: Number(amount),
      category,
      date: currentDate,
      description,
    });

    router.push('/calendar');
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-card flex w-150 flex-col gap-10 rounded-4xl border-2 p-8"
      >
        <div className="grid grid-cols-3 content-center gap-4">
          <Field>
            <FieldLabel htmlFor="amount">Сумма, ₽</FieldLabel>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Сумма" />
          </Field>

          <Field>
            <FieldLabel htmlFor="category">Категория</FieldLabel>
            <YSelect value={category} onChange={setCategory} options={CATEGORIES} />
          </Field>

          <Field>
            <FieldLabel htmlFor="date">Дата</FieldLabel>
            <YDatePicker date={currentDate} setDate={setCurrentDate} />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="description">Описание (необязательно)</FieldLabel>
          <Input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <Button className="rounded-full" type="submit">
          Добавить
        </Button>
      </form>
    </div>
  );
}
