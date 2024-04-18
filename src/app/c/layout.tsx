import Navbar from "@/navigation/navbar";
import ThemeProvider from "@/theme/ThemeProvider";
import { Provider } from "@/trpc-config/provider";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <Provider>
        <div className="flex flex-col w-full h-full">
          <Toaster />
          <div className="fixed w-full z-50">
            <Navbar></Navbar>
          </div>
          <div className="h-full w-full">{children}</div>
        </div>
      </Provider>
    </ThemeProvider>
  );
}
