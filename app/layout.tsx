"use client";

import GoogleMapsLoader from "@/components/GoogleMapsApiLoader/GoogleMapsApiLoader";
import NavBar from "@/components/NavBar";
import QuizProvider from "@/components/QuizProvider";
import "@/styles/globals.css";
import { Nunito } from "next/font/google";
import { ReactNode } from "react";

const font = Nunito({ weight: ["400"], subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <QuizProvider>
        <body className={`${font.className} min-h-screen`}>
          <NavBar />
          <main>
            {/* TODO: not totally safe. need to provide context or something to lower components that will 
          allow them to determine whether the API has loaded. */}
            <GoogleMapsLoader />
            {children}
          </main>
        </body>
      </QuizProvider>
    </html>
  );
}
