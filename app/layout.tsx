import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "6+1 Week Cycle Calendar",
  description: "A premium calendar component for 6 weeks work + 1 week rest cycles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

