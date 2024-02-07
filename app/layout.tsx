import { Nav } from "@/components/nav";
import { QuizProvider } from "@/providers";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const font = Nunito({ weight: ["400"], subsets: ["latin"] });

const metadata: Metadata = {
  title: "Sphericle",
  description: "Learn the world.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className={font.className}>
        <Nav />
        <main className="h-[calc(100vh-4rem)] overflow-auto custom-scrollbar">
          <QuizProvider>{children}</QuizProvider>
          <Toaster containerStyle={{ marginTop: "4rem" }} />
        </main>
      </body>
    </html>
  );
};

export { metadata };
export default RootLayout;
