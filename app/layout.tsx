import AllFeaturesProvider from "@/components/all-features-provider";
import Nav from "@/components/nav";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const font = Nunito({ weight: ["400"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sphericle",
  description: "Learn the world.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Nav />
        <main className="h-[calc(100vh-4rem)] overflow-auto custom-scrollbar">
          <AllFeaturesProvider>{children}</AllFeaturesProvider>
          <Toaster containerStyle={{ marginTop: "4rem" }} />
        </main>
      </body>
    </html>
  );
}
