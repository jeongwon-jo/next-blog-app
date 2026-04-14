import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen text-sm lg:text-base">
      <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)}/>
      <div className="flex flex-1 flex-col">
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex flex-1 flex-col overflow-y-auto">
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
