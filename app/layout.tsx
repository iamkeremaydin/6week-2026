import type { Metadata } from "next";
import { LazyMotion, domAnimation } from "motion/react";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { CycleNamingProvider } from "@/lib/context/CycleNamingContext";
import './globals.css';

export const metadata: Metadata = {
  title: "6+1 Week Cycle Calendar",
  description: "A premium calendar component for 6 weeks work + 1 week rest cycles",
};

/**
 * Root layout with language and cycle naming providers.
 * Detects browser language and displays content in Turkish or English without URL routing.
 * Manages global cycle names with localStorage persistence.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <CycleNamingProvider>
            {/* LazyMotion reduces bundle size by ~50% while maintaining full animation capabilities */}
            <LazyMotion features={domAnimation} strict>
              {children}
            </LazyMotion>
          </CycleNamingProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

