import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";

const SITE_NAME = "jjeong1Log";
const DEFAULT_DESCRIPTION = "jjeong1의 개발 블로그";

const queryClient = new QueryClient()
export default function App({ Component, pageProps }: AppProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { seo } = pageProps;

  const title = seo?.title ? `${seo.title} | ${SITE_NAME}` : SITE_NAME;
  const description = seo?.description ?? DEFAULT_DESCRIPTION;

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={seo?.title ?? SITE_NAME} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={seo?.type ?? "website"} />
        {seo?.image && <meta property="og:image" content={seo.image} />}
      </Head>
      <div className="flex h-screen w-screen text-sm lg:text-base">
        <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)}/>
        <div className="flex flex-1 flex-col">
          <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <div className="flex flex-1 flex-col overflow-y-auto">
            <main className="flex-1 pb-20 pt-8">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </QueryClientProvider>
    
  );
}
