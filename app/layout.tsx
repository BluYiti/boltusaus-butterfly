import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Great_Vibes } from "next/font/google";

import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

// Font
const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});
const fontSerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-serif",
});
const fontScript = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
})

// Head
export const metadata: Metadata = {
  title: "Butterfly",
  description: "A psychotherapy platform",
};

// Root
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-light-200 font-sans antialiases",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
