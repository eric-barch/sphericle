import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
    initGoogleMaps?: () => void;
  }
}

const useGoogleLibraries = (onLoaded?: () => void) => {
  useEffect(() => {
    let scriptLoaded = false;

    if (window.google && window.google.maps) {
      onLoaded?.();
      return;
    }

    const existingScript = document.querySelector(
      'script[src^="https://maps.googleapis.com/maps/api/js"]',
    );
    if (existingScript) {
      const handleScriptLoad = () => {
        if (!scriptLoaded) {
          scriptLoaded = true;
          onLoaded?.();
        }
      };
      existingScript.addEventListener("load", handleScriptLoad);

      return () => {
        existingScript.removeEventListener("load", handleScriptLoad);
      };
    }

    const loadGoogleMaps = async () => {
      const script = document.createElement("script");
      const params = new URLSearchParams({
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        v: "weekly",
        callback: "initGoogleMaps",
        libraries: "places", // Add this line
      });

      script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error("Google Maps API failed to load.");
      };

      window.initGoogleMaps = () => {
        delete window.initGoogleMaps;
        onLoaded?.();
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [onLoaded]);
};

export default useGoogleLibraries;
