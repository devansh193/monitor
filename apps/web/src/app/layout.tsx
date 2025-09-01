import { Geist, Geist_Mono } from 'next/font/google';
import { TRPCReactProvider } from '../trpc/client';
import { ThemeProvider } from 'next-themes';
import type { Metadata } from 'next';
import '@repo/ui/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Better Uptime',
  description: 'Monitor your websites and APIs with Better Uptime.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} bg-[#171717] antialiased`}>
          <ThemeProvider
            attribute={'class'}
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </TRPCReactProvider>
  );
}
