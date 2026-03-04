'use client';

import { useExpenses } from '@/app/use-expenses';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function ChartsPage() {
  const router = useRouter();

  const { expenses } = useExpenses();
  // const { getLabel } = useCategories();

  const chartConfig = {
    amount: {
      label: 'Сумма',
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-1 items-center justify-center">
      <ChartContainer config={chartConfig} className="p-6 border-2 rounded-4xl min-h-50 w-3/4">
        <BarChart accessibilityLayer data={expenses}>
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => format(value, 'dd')}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <CartesianGrid vertical={false} />

          <Bar
            onClick={(e) => router.push(`/day/${e.date}`)}
            dataKey="amount"
            fill="var(--color-primary)"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
