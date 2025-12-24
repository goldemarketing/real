import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
// import { Header } from '@/components/layout/header'; // مش محتاجينها هنا طالما هي جوه Wrapper
// import { Footer } from '@/components/layout/footer'; // مش محتاجينها هنا طالما هي جوه Wrapper
import { PageTransitionProvider } from '@/components/layout/page-transition-provider';
import { ThemeProvider } from '@/components/layout/theme-provider';
import ClickSpark from '@/components/click-spark';
import { ReduxProvider } from '@/components/providers/redux-provider';
import { PublicLayoutWrapper } from '@/components/layout/public-layout-wrapper';

// 👇 1. ضفنا استدعاء موفر اللغة (تأكد إن المسار ده صح زي ما كان في الخطأ)
import { LanguageProvider } from "@/context/language-context";

export const metadata: Metadata = {
  title: 'Four Seasons Real Estate',
  description: '.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <ReduxProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >
            {/* 👇 2. ضفنا موفر اللغة هنا عشان يغطي الموقع كله */}
            <LanguageProvider>
                
                <ClickSpark>
                  <PageTransitionProvider>
                    
                    {/* بما إن الهيدر موجود جوه الرابر ده، لازم يكون جوه LanguageProvider */}
                    <PublicLayoutWrapper>
                      {children}
                    </PublicLayoutWrapper>
                    
                  </PageTransitionProvider>
                  <Toaster />
                </ClickSpark>

            </LanguageProvider>

          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}