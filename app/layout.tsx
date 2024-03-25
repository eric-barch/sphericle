"use client";

import {
  QuizBuilderProvider,
  QuizProvider,
  QuizTakerProvider,
} from "@/providers";
import "@/styles/globals.css";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ThemeProvider } from "next-themes";
import { Nunito } from "next/font/google";
import { ComponentProps } from "react";
import { Toaster } from "react-hot-toast";

const font = Nunito({ weight: ["400"], subsets: ["latin"] });

const RootLayout = (props: ComponentProps<"html">) => {
  const { children } = props;

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={font.className}>
        <ThemeProvider attribute="class">
          <main className="min-h-lvh dark:bg-gray-1 dark:text-white">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <QuizProvider>
                <QuizTakerProvider>
                  <QuizBuilderProvider>{children}</QuizBuilderProvider>
                </QuizTakerProvider>
              </QuizProvider>
              <Toaster containerStyle={{ marginTop: "4rem" }} />
            </APIProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
};

// export { metadata };
export default RootLayout;
