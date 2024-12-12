import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Use the Render URL for the backend
const socket = io('https://socket-io-v1.onrender.com'); // Update with your Render URL
// const socket = io('http://localhost:5000/');

const DataComparison = () => {
    const [data, setData] = useState({}); // Data for all cities
    const [cities, setCities] = useState([]); // Array of city names
    const [cityName, setCityName] = useState(''); // Input for new city

    useEffect(() => {
        // Listen for updates from the server
        socket.on('update-data', (newData) => {
            console.log('Received data:', newData);
            setData((prevData) => ({
                ...prevData,
                [newData.cityName]: newData, // Merge new city data into state
            }));
        });

        return () => {
            // Clean up listeners when the component unmounts
            socket.off('update-data');
        };
    }, []);

    const handleCitySubmit = () => {
        if (cityName && !cities.includes(cityName)) {
            setCities((prevCities) => [...prevCities, cityName]); // Add city to the list
            socket.emit('fetch-city-data', cityName); // Request data for the new city
            setCityName(''); // Clear input
        }
    };

    // Prepare chart data
    const chartData = {
      labels: cities, // City names
      datasets: [
          {
              label: 'Average Sensor Data',
              data: cities.map((city) => {
                  const cityData = data[city]?.data?.cities?.[0]?.airComponents;
                  if (cityData) {
                      const total = cityData.reduce((sum, component) => sum + component.sensorData, 0);
                      return total / cityData.length; // Average sensor data
                  }
                  return 0;
              }),
              backgroundColor: cities.map((city) => {
                  const cityData = data[city]?.data?.cities?.[0]?.airComponents;
                  if (cityData) {
                      const total = cityData.reduce((sum, component) => sum + component.sensorData, 0);
                      const avgAqi = total / cityData.length;
  
                      // Assign colors based on AQI range
                      if (avgAqi <= 50) return 'rgba(75, 192, 75, 0.6)'; // Green
                      if (avgAqi <= 100) return 'rgba(192, 192, 75, 0.6)'; // Yellow
                      if (avgAqi <= 200) return 'rgba(255, 165, 0, 0.6)';  // Orange
                      if (avgAqi <= 300) return 'rgba(255, 0, 0, 0.6)';    // Red
                      if (avgAqi <= 400) return 'rgba(128, 0, 128, 0.6)';  // Purple
                      return 'rgba(128, 0, 0, 0.6)';                        // Maroon
                  }
                  return 'rgba(200, 200, 200, 0.6)'; // Default Gray
              }),
              borderColor: cities.map((city) => {
                  const cityData = data[city]?.data?.cities?.[0]?.airComponents;
                  if (cityData) {
                      const total = cityData.reduce((sum, component) => sum + component.sensorData, 0);
                      const avgAqi = total / cityData.length;
  
                      // Assign border colors based on AQI range
                      if (avgAqi >= 0 && avgAqi <= 50) return 'rgba(75, 192, 75, 1)'; // Green (Good)
                      if (avgAqi > 50 && avgAqi <= 100) return 'rgba(192, 192, 75, 1)'; // Yellow (Moderate)
                      if (avgAqi > 100 && avgAqi <= 150) return 'rgba(255, 165, 0, 1)'; // Orange (Unhealthy for Sensitive Groups)
                      if (avgAqi > 150 && avgAqi <= 200) return 'rgba(255, 0, 0, 1)'; // Red (Unhealthy)
                      if (avgAqi > 200 && avgAqi <= 300) return 'rgba(128, 0, 128, 1)'; // Purple (Very Unhealthy)
                      if (avgAqi > 300 && avgAqi <= 500) return 'rgba(128, 0, 0, 1)'; // Maroon (Hazardous)
                       // Maroon
                  }
                  return 'rgba(200, 200, 200, 1)'; // Default Gray
              }),
              borderWidth: 1,
          },
      ],
  };
  

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'City Air Quality Comparison (Average Sensor Data)',
            },
        },
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Real-Time Air Quality Data</h1>

            {/* Input field to add a city */}
            <div>
                <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="Enter city name"
                    style={{ padding: '10px', fontSize: '16px', width: '200px' }}
                />
                <button
                    onClick={handleCitySubmit}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        marginLeft: '10px',
                        cursor: 'pointer',
                    }}
                >
                    Add City
                </button>
            </div>

            {/* Render chart */}
            <div style={{ margin: '50px auto', width: '80%' }}>
                <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Render data for all subscribed cities */}
            {cities.length > 0 ? (
                cities.map((city) => (
                    <div key={city} style={{ marginBottom: '40px' }}>
                        <h2>{city}</h2>
                        {data[city] && data[city].data && data[city].data.cities && data[city].data.cities[0] ? (
                            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Sensor ID</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Data</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Name</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data[city].data.cities[0].airComponents.map((component, idx) => (
                                        <tr key={idx}>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{component.senDevId}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{component.sensorData}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{component.sensorName}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{component.sensorUnit || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Loading data for {city}...</p>
                        )}
                    </div>
                ))
            ) : (
                <p>No cities added yet.</p>
            )}
        </div>
    );
};

export default DataComparison;
