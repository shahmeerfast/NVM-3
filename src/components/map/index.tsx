"use client";

import React, { useEffect, useState } from "react";
import L, { LatLngBoundsLiteral } from "leaflet"; // Import Leaflet library
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"; // Add Polyline component
import "leaflet/dist/leaflet.css"; // Leaflet CSS
import "leaflet-routing-machine"; // For routing
import { FaSpinner } from "react-icons/fa"; // Spinner for loading state

type MapProps = {
  userLocation: GeolocationCoordinates;
  wineryLocation: {
    latitude: number;
    longitude: number;
  };
};

const Map: React.FC<MapProps> = ({ userLocation, wineryLocation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLocation && wineryLocation) {
      setLoading(false);
    }
  }, [userLocation, wineryLocation]);

  useEffect(() => {
    // Fix for marker icon issue with Leaflet in React
    const defaultIcon = new L.Icon({
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  // Adjust map zoom and center on user and winery location
  const MapAdjuster = () => {
    const map = useMap();
    useEffect(() => {
      if (userLocation && wineryLocation) {
        const bounds: LatLngBoundsLiteral = [
          [userLocation.latitude, userLocation.longitude],
          [wineryLocation.latitude, wineryLocation.longitude],
        ];
        map.fitBounds(bounds); // Adjust bounds to include both points
      }
    }, [userLocation, wineryLocation, map]);

    return null;
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          <FaSpinner className="animate-spin text-2xl text-gray-500" />
        </div>
      )}

      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
        scrollWheelZoom={false}
      >
        <MapAdjuster />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker for user's location */}
        <Marker position={{ lat: userLocation.latitude, lng: userLocation.longitude }}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Marker for winery's location */}
        <Marker position={{ lat: wineryLocation.latitude, lng: wineryLocation.longitude }}>
          <Popup>Winery Location</Popup>
        </Marker>

        {/* Polyline representing the path between user's location and winery */}
        <Polyline
          positions={[
            { lat: userLocation.latitude, lng: userLocation.longitude },
            { lat: wineryLocation.latitude, lng: wineryLocation.longitude },
          ]}
          color="blue" // Line color
          weight={4} // Line thickness
          opacity={0.7} // Line opacity
        />
      </MapContainer>
    </div>
  );
};

export default Map;
