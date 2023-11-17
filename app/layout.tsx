"use client";

import GoogleMapsLoader from "@/components/GoogleMapsApiLoader/GoogleMapsApiLoader";
import NavBar, { NavBarHeightContext } from "@/components/NavBar";
import "@/styles/globals.css";
import { Nunito } from "next/font/google";

const font = Nunito({ weight: ["400"], subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navBarHeight = 48;

  return (
    <html lang="en">
      <body className={`${font.className} min-h-screen`}>
        <NavBarHeightContext.Provider value={navBarHeight}>
          <NavBar navBarHeight={navBarHeight} />
          <main>
            {/* TODO: not totally safe. need to provide context or something to lower components that will 
          allow them to determine whether the API has loaded. */}
            <GoogleMapsLoader />
            {children}
          </main>
        </NavBarHeightContext.Provider>
      </body>
    </html>
  );
}
