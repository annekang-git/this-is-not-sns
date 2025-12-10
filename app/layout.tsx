import './globals.css';
import Header from '@/components/Header';

export const metadata = { title: 'This Is Not SNS' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pt-2" style={{ paddingBottom: 'var(--composer-h, 180px)' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
