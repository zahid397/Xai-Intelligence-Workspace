import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Xai — Intelligence Workspace',
  description:
    'Xai converts complex information into structured insights and intelligent automation, at enterprise scale.',
  metadataBase: new URL('https://xai-intelligence.vercel.app'),
  openGraph: {
    title: 'Xai — Intelligence Workspace',
    description: 'From raw data to structured intelligence to automated action.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050816',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans">
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-signal-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <ErrorBoundary
          fallback={
            <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
              <p className="text-lg font-semibold text-ink-100">Something went wrong.</p>
              <p className="text-sm text-ink-500">
                Please refresh the page. If this keeps happening, the issue has been logged.
              </p>
            </div>
          }
        >
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
