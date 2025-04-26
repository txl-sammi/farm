"use client";

import { useEffect, useRef } from "react";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface GooglePlacesAutocompleteProps {
  onLocationSelect: (location: Location) => void;
  initialAddress?: string;
}

export default function GooglePlacesAutocomplete({ onLocationSelect, initialAddress }: GooglePlacesAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const placeElementRef = useRef<any>(null); // Save reference to the PlaceAutocompleteElement

  useEffect(() => {
    let placeAutocomplete: any;

    async function loadAutocomplete() {
      //@ts-ignore
      await google.maps.importLibrary("places");
      //@ts-ignore
      placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();
      placeAutocomplete.setAttribute("style", "width: 100%; height: 40px;");
      placeAutocomplete.setAttribute("placeholder", "Enter a location");

      if (initialAddress) {
        placeAutocomplete.value = initialAddress; // <-- Pre-fill value
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(placeAutocomplete);
        placeElementRef.current = placeAutocomplete; // Save ref

        //@ts-ignore
        placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
          const place = placePrediction.toPlace();
          await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
          console.log("Selected place:", place);
          if (place.location && place.formattedAddress) {
            const locationData: Location = {
              latitude: place.location.lat(),
              longitude: place.location.lng(),
              address: place.formattedAddress,
            };
            console.log("Selected location:", locationData);
            onLocationSelect(locationData);  // ✅ Now safely call parent
          } else {
            console.warn("Selected place does not have location or address data.");
          }
        });
      }
    }

    if (typeof window !== "undefined" && "google" in window) {
      loadAutocomplete();
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  // ⚡ Update input value when initialAddress changes
  useEffect(() => {
    if (placeElementRef.current && initialAddress) {
      placeElementRef.current.value = initialAddress;
    }
  }, [initialAddress]);

  return <div ref={containerRef} />;
}