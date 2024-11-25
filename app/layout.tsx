import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "@/context/SessionContext";
import ToastProviderWrapper from "@/components/providers/ToastProvider";
import ArtGalleryNav from "@/components/home/ArtGalleryNav";
import Footer from "@/components/home/footer";

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
  title: "The Gallery Vault",
  description: "Your art auction home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionProvider>
          <ArtGalleryNav />
          <main className="flex-grow pt-16"> {children}</main>
          <Footer />
          <ToastProviderWrapper />
        </SessionProvider>
      </body>
    </html>
  );
}
