import './globals.css';
import { I18nProvider } from '@/components/I18nProvider';
import Header from '@/components/Header';

export const metadata = { title: 'This Is Not SNS' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <I18nProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
