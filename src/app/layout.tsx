import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/widgets/header';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Finance Tracker',
  description: 'Personal finance tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${jetbrainsMono.variable} antialiased dark flex flex-col min-h-[calc(100vh-var(--header-height))]`}
      >
        <Providers>
          <Header />
          <main className="main flex-1 flex flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
