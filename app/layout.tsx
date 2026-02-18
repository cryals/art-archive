
import type { Metadata } from 'next';
import { Share_Tech_Mono, Oswald } from 'next/font/google';
import './globals.css';

const mono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin', 'cyrillic'], // Added cyrillic support
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ART//ARCHIVE',
  description: 'NanoTrasen Directorate secure operating system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${mono.variable} ${oswald.variable} antialiased h-full overflow-hidden`}>
      <body className="h-full bg-[#080808] text-[#f0f0f0] font-mono selection:bg-red-900 selection:text-white overflow-hidden">
        <div className="scanlines" />
        {children}
      </body>
    </html>
  );
}
