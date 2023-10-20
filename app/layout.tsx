import GoogleMapsLoader from "@/components/GoogleMapsApiLoader/GoogleMapsApiLoader";
import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import { Metadata } from "next";
import { Nunito } from "next/font/google";

export const metadata: Metadata = {
  title: "globle",
};

const font = Nunito({ weight: ["400"], subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [googleMapsLoaded, setGoogleMapsLoaded] = useState<boolean>(false);

  return (
    <html lang="en">
      <body className={`${font.className} min-h-screen`}>
        <NavBar />
        <main>
          {/* TODO: not safe. need to provide context or something to lower components that will 
          allow them to determine whether the API has loaded. */}
          <GoogleMapsLoader />
          {children}
        </main>
      </body>
    </html>
  );
}
