import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "@/styles/globals.css";
import { ReactNode } from "react";
import Nav from "@/components/Nav";
import AllFeaturesProvider from "@/components/AllFeaturesProvider";
import { Toaster } from "react-hot-toast";
import QuizBuilderProvider from "@/components/QuizBuilder/QuizBuilderProvider";

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
        <main>
          <AllFeaturesProvider>
            <QuizBuilderProvider>{children}</QuizBuilderProvider>
          </AllFeaturesProvider>
          <Toaster containerStyle={{ marginTop: "3rem" }} />
        </main>
      </body>
    </html>
  );
}
