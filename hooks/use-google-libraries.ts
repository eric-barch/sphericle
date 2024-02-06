import { useEffect, useState } from "react";

declare global {
  interface Window {
    google: any;
    initGoogleMaps?: () => void;
    autocompleteService?: google.maps.places.AutocompleteService;
    geocoder?: google.maps.Geocoder;
  }
}

const useGoogleLibraries = (onLoaded?: () => void) => {
  const [servicesLoaded, setServicesLoaded] = useState(false);

  useEffect(() => {
    let scriptLoaded = false;

    if (window.google && window.google.maps) {
      if (!window.autocompleteService) {
        window.autocompleteService =
          new window.google.maps.places.AutocompleteService();
      }
      if (!window.geocoder) {
        window.geocoder = new window.google.maps.Geocoder();
      }
      if (!servicesLoaded) {
        setServicesLoaded(true);
        onLoaded?.();
      }
      return;
    }

    const existingScript = document.querySelector(
      'script[src^="https://maps.googleapis.com/maps/api/js"]',
    );
    if (existingScript) {
      const handleScriptLoad = () => {
        if (!scriptLoaded) {
          scriptLoaded = true;
          window.autocompleteService =
            new window.google.maps.places.AutocompleteService();
          window.geocoder = new window.google.maps.Geocoder();
          setServicesLoaded(true);
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
        libraries: "places",
      });

      script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error("Google Maps API failed to load.");
      };

      window.initGoogleMaps = () => {
        delete window.initGoogleMaps;
        window.autocompleteService =
          new window.google.maps.places.AutocompleteService();
        window.geocoder = new window.google.maps.Geocoder();
        setServicesLoaded(true);
        onLoaded?.();
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [onLoaded, servicesLoaded]);

  return { servicesLoaded };
};

export { useGoogleLibraries };
