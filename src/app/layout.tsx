import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BEMMS - Biomedical Equipment Maintenance Management System",
  description: "Minimalist, medical-grade equipment maintenance tracking for hospitals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background antialiased text-foreground`}>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 overflow-auto flex flex-col relative w-full h-screen">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 md:px-6 shadow-sm z-10 sticky top-0">
                <SidebarTrigger className="-ml-1" />
                <div className="mr-auto" />
              </header>
              <div className="flex-1 p-6 lg:p-8 bg-slate-50/50">
                {children}
              </div>
            </main>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
