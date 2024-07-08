import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shadowcord",
  description: "Explore my own discord, a private chat and others, made by TheLorianOMG, with love ❤️!",
  icons: {
    icon: 'https://i.imgur.com/vGX6K7p.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
