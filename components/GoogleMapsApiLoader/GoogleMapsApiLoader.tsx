"use client";

import { useEffect, FC } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapsLoaderProps {
  onLoaded?: () => void;
}

const GoogleMapsLoader: FC<GoogleMapsLoaderProps> = ({ onLoaded }) => {
  useEffect(() => {
    if (window.google && window.google.maps) {
      if (onLoaded) {
        onLoaded();
      }
      return;
    }

    const loadGoogleMaps = (g: {
      key: string;
      v: string;
      [key: string]: string;
    }) => {
      ((g) => {
        var h: Promise<any> | undefined,
          a,
          k,
          p = "The Google Maps JavaScript API",
          c = "google",
          l = "importLibrary",
          q = "__ib__",
          m = document,
          b = window as { [key: string]: any };
        b = b[c] || (b[c] = {});
        var d = b.maps || (b.maps = {}),
          r = new Set(),
          e = new URLSearchParams(),
          u = () =>
            h ||
            (h = new Promise(async (f, n) => {
              await (a = m.createElement("script"));
              e.set("libraries", [...r] + "");
              for (let k in g)
                if (Object.prototype.hasOwnProperty.call(g, k)) {
                  e.set(
                    k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
                    g[k as keyof typeof g],
                  );
                }
              e.set("callback", c + ".maps." + q);
              a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
              d[q] = f;
              a.onerror = () => {
                n(Error(p + " could not load."));
              };
              a.nonce =
                (m.querySelector("script[nonce]") as HTMLScriptElement)
                  ?.nonce || "";
              m.head.append(a);
            }));
        d[l]
          ? console.warn(p + " only loads once. Ignoring:", g)
          : (d[l] = (f: string, ...n: any[]) =>
              r.add(f) && u().then(() => d[l](f, ...n)));
      })({
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        v: "weekly",
      });

      window.google.maps.__ib__ = () => {
        if (onLoaded) {
          onLoaded();
        }
      };
    };

    loadGoogleMaps({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      v: "weekly",
    });
  }, [onLoaded]);

  return null;
};

export default GoogleMapsLoader;
