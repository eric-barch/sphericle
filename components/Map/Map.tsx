'use client'

import { useEffect, useRef } from 'react';

export default function Map({
  center,
  zoom,
  mapId,
  disableDefaultUI,
}: {
  center: google.maps.LatLngLiteral,
  zoom: number,
  mapId: string,
  disableDefaultUI: boolean,
}) {
  const ref = useRef<HTMLDivElement>(undefined!);

  useEffect(() => {
    new window.google.maps.Map(ref.current, {
      center,
      zoom,
      mapId,
      disableDefaultUI,
    });
  });

  return (
    <div className='flex flex-grow' ref={ref} id="map" />
  );
}