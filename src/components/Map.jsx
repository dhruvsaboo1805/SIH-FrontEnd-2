import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
const API_KEY = "5796abbde9106b7da4febfae8c44c232";

// Function to get color based on AQI value
const getAqiColor = (aqi) => {
  if (aqi <= 50) return "green";
  if (aqi <= 100) return "yellow";
  if (aqi <= 150) return "orange";
  if (aqi <= 200) return "red";
  if (aqi <= 300) return "purple";
  return "maroon"; // For hazardous
};

const Map = ({ city }) => {
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 }); // Default center: Delhi
  const [markerPosition, setMarkerPosition] = useState({ lat: 28.6139, lng: 77.209 });
  const [mapKey, setMapKey] = useState(0); // Key to force re-render of the map
  const [aqiData, setAqiData] = useState([]); // State to store AQI data from API

  useEffect(() => {
    if (city) {
      const fetchCityCoordinates = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/find?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
          );
          const data = await response.json();

          if (data.cod === "200" && data.list.length > 0) {
            const { lat, lon } = data.list[0].coord;
            setCenter({ lat, lng: lon });
            setMarkerPosition({ lat, lng: lon });
            setMapKey((prevKey) => prevKey + 1); // Force re-render
          } else {
            alert("City not found.");
          }
        } catch (error) {
          console.error("Error fetching city data:", error);
          alert("Failed to fetch city coordinates. Please try again.");
        }
      };

      fetchCityCoordinates();
    }
  }, [city]);

  // Fetch AQI data when component mounts or updates
  useEffect(() => {
    // Simulate AQI data fetch as before
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        key={mapKey} // Set the key to force re-render of the map
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {aqiData.map((sensor, index) => {
          const { lat, lon, aqi } = sensor;
          const color = getAqiColor(aqi);

          return (
            <Circle
              key={index}
              center={[lat, lon]}
              radius={500}
              fillColor={color}
              color={color}
              fillOpacity={0.6}
            >
              <Popup>
                <strong>AQI: {aqi}</strong>
                <br />
                Latitude: {lat}
                <br />
                Longitude: {lon}
              </Popup>
            </Circle>
          );
        })}

        <Marker position={[markerPosition.lat, markerPosition.lng]}>
          <Popup>Drag me or search for a city!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
