import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/theme/ThemeProvider";
import { Provider } from "@/trpc-config/provider";
import { Toaster as ST } from "sonner";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "数字阁",
  description: "数字产品分享中心",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider>
        <Provider>
          <body className={inter.className}>
            <Toaster />
            <div className="flex flex-col h-[100vh] w-[100vw]">{children}</div>
            <ST position="top-center" richColors></ST>
          </body>
        </Provider>
      </ThemeProvider>
    </html>
  );
}
