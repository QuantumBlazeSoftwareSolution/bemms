import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto flex flex-col relative w-full min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 md:px-6 shadow-sm z-10 sticky top-0">
          <SidebarTrigger className="-ml-1" />
          <div className="mr-auto" />
        </header>
        <div className="flex-1 p-6 lg:p-8 bg-slate-50/50">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
