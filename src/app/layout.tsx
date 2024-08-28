import { Toaster } from "@/components/login/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100;0,400;1,100;1,400&display=swap"
        />
      </head>
      <body
        className={cn(
          "antialiased bg-background text-foreground",
          fontHeading.variable,
          fontBody.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
