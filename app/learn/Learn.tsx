'use client'

import Map from '@/components/Map';
import { Wrapper } from '@googlemaps/react-wrapper';

export default function Learn() {
  const center = { lat: -34.397, lng: 150.644 };
  const zoom = 4;
  const mapId = '45205d0d55355e0d';
  const disableDefaultUI = true;

  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map center={center} zoom={zoom} mapId={mapId} disableDefaultUI={disableDefaultUI} />
    </Wrapper>
  );
}