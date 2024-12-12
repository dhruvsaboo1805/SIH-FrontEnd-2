import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const API_KEY = "5796abbde9106b7da4febfae8c44c232"; // Replace with your actual API key

// Function to get color based on AQI value
const getAqiColor = (aqi) => {
  if (aqi <= 50) return "green";
  if (aqi <= 100) return "yellow";
  if (aqi <= 150) return "orange";
  if (aqi <= 200) return "red";
  if (aqi <= 300) return "purple";
  return "maroon"; // For hazardous
};

const calculateAqi = (pollutants) => {
  if (!pollutants || Object.keys(pollutants).length === 0) return 0;
  // console.log("Pollutants:", pollutants);

  // Example: Weighted average calculation (adjust weights per pollutant if needed)
  const weights = {
    PM10: 0.5,
    PM25: 0.3,
    NO2: 0.1,
    SO2: 0.05,
    CO: 0.05,
  };

    const airComponents = pollutants.airComponents;

    const formattedPollutants = airComponents.reduce((acc, component) => {
      acc[component.senDevId] = component.sensorData || 0;
      return acc;
    }, {});


  const totalAqi = Object.entries(formattedPollutants).reduce((acc, [key, value]) => {
    const weight = weights[key.toUpperCase()] || 0; // Use weight if defined, else 0
    return acc + value * weight;
  }, 0);

  // console.log("Total AQI:", totalAqi, typeof totalAqi);
  return Math.round(totalAqi); // Return rounded AQI value
};

const Map = ({ city , stations}) => {
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 }); // Default center: Delhi
  const [markerPosition, setMarkerPosition] = useState({ lat: 28.6139, lng: 77.209 });
  const [mapKey, setMapKey] = useState(0); // Key to force re-render of the map
  const [aqiData, setAqiData] = useState([]); // State to store AQI data from API
  // Fetch city coordinates from OpenWeatherMap API
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
            console.error("City not found.");
          }
        } catch (error) {
          console.error("Error fetching city coordinates:", error);
          alert("Failed to fetch city coordinates. Please try again.");
        }
      };

      fetchCityCoordinates();
    }
  }, [city]);

  // Fetch AQI data from an AQI API (example URL, you need to replace it with your actual AQI source)
  useEffect(() => {
    const fetchAqi = async () => {
      try {
        if(stations){
        const aqiInfo = stations.map((station) => {
          const { lat, lon, ...pollutants } = station;
          return {
            lat,
            lon,
            aqi: calculateAqi(pollutants),
          };
        });
        setAqiData(aqiInfo); // Store AQI data to state
      }
      } catch (error) {
        console.error("Error fetching AQI data:", error);
      }
    };

    fetchAqi();
  }, [city, stations]);

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        key={mapKey} // Set the key to force re-render of the map
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ width: "100%", height: "360px", border: "1px solid #ccc" }}
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
              radius={500} // Adjust radius as needed
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