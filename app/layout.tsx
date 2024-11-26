import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import ClientWrapper from "./ClientWrapper";

const geistSans = GeistSans;
const geistMono = GeistMono;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper> {children}</ClientWrapper>
      </body>
    </html>
  );
}
