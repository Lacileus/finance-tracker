'use client';

import { usePathname } from 'next/navigation';
import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components';
import { useRouter } from 'next/navigation';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
}

export function NavItem({ href, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname === href;

  return (
    <Button onClick={() => router.push(href)} variant="ghost" className="size-10 cursor-pointer">
      <Icon className={`size-6 ${isActive ? 'text-primary' : 'text-accent'}`} />
    </Button>
  );
}
