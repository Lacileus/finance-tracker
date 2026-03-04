'use client';

import { CalendarIcon, TableIcon, ChartPieIcon } from 'lucide-react';
import { NavItem } from './NavItem';

const NAV_ITEMS = [
  { label: 'Календарь', href: '/calendar', icon: CalendarIcon },
  { label: 'Расходы', href: '/expenses', icon: TableIcon },
  { label: 'Графики', href: '/charts', icon: ChartPieIcon },
];

export function Header() {
  return (
    <header className="mt-4 flex justify-center gap-4">
      <nav className="flex gap-4">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} href={item.href} icon={item.icon} />
        ))}
      </nav>

    </header>
  );
}
