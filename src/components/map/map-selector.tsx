import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useState, useEffect } from "react";

// Configure default icon for Leaflet markers
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type MapSelectorProps = {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number, address: string) => void;
};

// Component that smoothly changes the map view when coordinates update
function ChangeMapView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, map.getZoom(), { animate: true, duration: 1.5 });
  }, [coords, map]);
  return null;
}

export const MapSelector: React.FC<MapSelectorProps> = ({ latitude, longitude, onChange }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Fetch suggestions from the Nominatim API
  const fetchSuggestions = async () => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Debounce the search input so that it fetches after a short delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle user selecting a suggestion from the dropdown
  const handleSelectSuggestion = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    setQuery(suggestion.display_name);
    setSuggestions([]);
    onChange(lat, lon, suggestion.display_name);
  };

  // Allow map clicks to update location
  function LocationMarker() {
    useMapEvents({
      click(e) {
        onChange(e.latlng.lat, e.latlng.lng, query);
      },
    });
    return latitude && longitude ? <Marker position={[latitude, longitude]} /> : null;
  }

  return (
    <div className="relative">
      {/* Search Field with Suggestions Dropdown */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input input-bordered w-full"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-50 bg-white border border-gray-300 w-full max-h-60 overflow-auto mt-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSelectSuggestion(suggestion)} className="p-2 hover:bg-gray-200 cursor-pointer">
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map Container */}
      <MapContainer center={[latitude || 51.505, longitude || -0.09]} zoom={13} className="w-full h-64 rounded z-0">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ChangeMapView coords={[latitude || 51.505, longitude || -0.09]} />
        <LocationMarker />
      </MapContainer>

      {/* Display Selected Coordinates */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <input type="text" readOnly className="input input-bordered" value={`Lat: ${latitude.toFixed(4)}`} />
        <input type="text" readOnly className="input input-bordered" value={`Lng: ${longitude.toFixed(4)}`} />
      </div>
    </div>
  );
};
