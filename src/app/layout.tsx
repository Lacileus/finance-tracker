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
        className={`${jetbrainsMono.variable} dark flex min-h-[calc(100vh-var(--header-height))] flex-col antialiased`}
      >
        <Providers>
          <Header />
          <main className="main flex flex-1 flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
