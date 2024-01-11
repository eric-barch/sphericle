import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "@/styles/globals.css";
import { ReactNode } from "react";
import Nav from "@/components/Nav";
import AllFeaturesProvider from "@/components/AllFeaturesProvider";
import { Toaster } from "react-hot-toast";
import QuizBuilderStateProvider from "@/components/QuizBuilder/QuizBuilderStateProvider";
import Head from "next/head"; // Importing the Head component

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
          <AllFeaturesProvider>
            <QuizBuilderStateProvider>{children}</QuizBuilderStateProvider>
          </AllFeaturesProvider>
          <Toaster containerStyle={{ marginTop: "3rem" }} />
        </main>
      </body>
    </html>
  );
}
