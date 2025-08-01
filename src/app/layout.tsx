import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientToastContainer from "../components/ClientToastContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chess Clock",
  description: "A chess clock application for timing chess games",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ClientToastContainer />
      </body>
    </html>
  );
}
