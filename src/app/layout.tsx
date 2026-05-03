import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import "@/styles/globals.css";
import type { Metadata } from "next";

const SITE_NAME = "JEONG1LOG";
const DEFAULT_DESCRIPTION = "정원의 개발 블로그";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers footer={<Footer />}>{children}</Providers>
      </body>
    </html>
  );
}
