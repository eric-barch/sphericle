"use client";

import {
  QuizProvider,
  QuizBuilderProvider,
  QuizTakerProvider,
} from "@/providers";
import "@/styles/globals.css";
import { APIProvider } from "@vis.gl/react-google-maps";
// import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const font = Nunito({ weight: ["400"], subsets: ["latin"] });

// const metadata: Metadata = {
//   title: "Sphericle",
//   description: "Learn your world.",
// };

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className={font.className}>
        <main className="min-h-lvh custom-scrollbar dark:bg-gray-3">
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <QuizProvider>
              <QuizTakerProvider>
                <QuizBuilderProvider>{children}</QuizBuilderProvider>
              </QuizTakerProvider>
            </QuizProvider>

            <Toaster containerStyle={{ marginTop: "4rem" }} />
          </APIProvider>
        </main>
      </body>
    </html>
  );
};

// export { metadata };
export default RootLayout;
