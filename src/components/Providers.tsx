"use client";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/utils/style";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-[calc(100dvh-8px)] w-screen text-sm lg:text-base">
        <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)} />
        <div className="flex flex-1 flex-col">
          <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <div className="flex flex-1 flex-col overflow-y-auto">
            <main className={cn("flex flex-1 flex-col pb-12 pt-8")}>
              {children}
            </main>
            {footer}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
