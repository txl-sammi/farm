"use client";

import { useEffect, useRef } from "react";

interface Location {
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  city?: string;
}

interface GooglePlacesAutocompleteProps {
  onLocationSelect: (location: Location) => void;
}

export default function GooglePlacesAutocomplete({ onLocationSelect }: GooglePlacesAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let placeAutocomplete: any;

    async function loadAutocomplete() {
      //@ts-ignore
      await google.maps.importLibrary("places");
      //@ts-ignore
      placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();
      placeAutocomplete.setAttribute("style", "width: 100%; height: 40px;");
      placeAutocomplete.setAttribute("placeholder", "Enter a location");

      if (containerRef.current) {
        // ⚡ Clear previous autocomplete if any
        containerRef.current.innerHTML = "";

        containerRef.current.appendChild(placeAutocomplete);

        //@ts-ignore
        placeAutocomplete.addEventListener('gmp-place-select', async (event) => {
          //@ts-ignore
          const placePrediction = event.placePrediction;
          const place = placePrediction.toPlace();
          await place.fetchFields({ fields: ['location', 'addressComponents'] });

          //@ts-ignore
          const locationData: Location = {
            latitude: place.location.lat(),
            longitude: place.location.lng(),
          };
          onLocationSelect(locationData);
        });
      }
    }

    if (typeof window !== "undefined" && "google" in window) {
      loadAutocomplete();
    }

    // ⚡ Cleanup function: optional if Google reinitializes it, but clean style
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [onLocationSelect]);

  return <div ref={containerRef} />;
}