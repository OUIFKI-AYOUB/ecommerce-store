import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ModalalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { ScrollReset } from '@/components/scroll-reset';
import ClientLayout from "./client-layout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Matjar leafifat",
  description: "Matjar leafifat",
  icons: {
    icon: '/images/loga.png',
    apple: '/images/loga.png'
  }
};

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`⚠️ Messages introuvables pour la langue : ${locale}`);
    return {}; // Évite une erreur en retournant un objet vide
  }
}


export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(locale);

  return (
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
<body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-y-auto`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ClientLayout>
              <ModalalProvider />
              <ToastProvider />
              <Navbar />
              <ScrollReset />
              <main className="flex-grow pt-16">
                {children}
              </main>
              <div dir="ltr">
                <Footer />
              </div>            </ClientLayout>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
