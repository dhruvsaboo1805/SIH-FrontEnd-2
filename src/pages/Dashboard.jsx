import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import { useEffect, useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import ProgressBar from "@ramonak/react-progress-bar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { LineChart, PieChart } from "../components/chart";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import WidgetItem from "../components/WidgetItem";

// Debouncing the input value
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [pollutants, setPollutants] = useState({});
  const [city, setCity] = useState("bhopal");
  const [cityAqi, setCityAqi] = useState("");
  const [newCity, setNewCity] = useState("bhopal");
  const [lastCity, setLastCity] = useState("bhopal");
  const [stations, setStations] = useState([]);

  // Debounce the city input value to trigger the API call after 500ms of no typing
  const debouncedCity = useDebounce(newCity, 700);

  // Function to calculate AQI
  const calculateAqi = (pollutants) => {
    if (!pollutants || Object.keys(pollutants).length === 0) return 0;
    const weights = {
      PM10: 0.5,
      PM25: 0.3,
      NO2: 0.1,
      SO2: 0.05,
      CO: 0.05,
    };

    const totalAqi = Object.entries(pollutants).reduce((acc, [key, value]) => {
      const weight = weights[key.toUpperCase()] || 0;
      return acc + value * weight;
    }, 0);

    return Math.round(totalAqi);
  };

  // Function to fetch AQI data
  const fetchAqiData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://sih.anujg.me/fetch/${debouncedCity}`);
      const data = response.data.data.cities[0];

      if (response && response.data.data.stations) {
        setStations(response.data.data.stations);
      }

      if (data && data.airComponents) {
        const airComponents = data.airComponents;

        const formattedPollutants = airComponents.reduce((acc, component) => {
          acc[component.senDevId] = component.sensorData || 0;
          return acc;
        }, {});

        setPollutants(formattedPollutants);

        const aqiValue = calculateAqi(formattedPollutants);
        setCityAqi(aqiValue);

        setLastCity(debouncedCity);
        toast.success("City data fetched successfully!");
      } else {
        throw new Error("No valid data received.");
      }
    } catch (error) {
      toast.error("Error fetching city data. Showing last searched city data.");
      setNewCity(lastCity);
    } finally {
      setLoading(false);
    }
  };

  // Fetch AQI data when debouncedCity changes
  useEffect(() => {
    if (debouncedCity) {
      fetchAqiData();
    }
  }, [debouncedCity]);
  // console.log(Object.keys(pollutants));
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        <Bar city={city} setCity={setCity} fetchAqiData={fetchAqiData} />
        {loading ? (
          <Loader />
        ) : (
          <div className="aqi-content">
            <section className="map-and-widget">
              <WidgetItem city={city} aqi={cityAqi ? cityAqi.toFixed(2) : "0"} stations={stations} />
            </section>

            <section className="aqi-bars-and-chart">
              <div className="aqi-bars">
                {Object.entries(pollutants).map(([key, value], index) => (
                  <AqiLevel
                    key={key}
                    value={value}
                    unit="µg/m³"
                    parameter={key.toUpperCase()}
                    color={"#21ed15"}
                  />
                ))}
              </div>
              <div className="bar-chart-container">
                <LineChart
                  data={Object.values(pollutants)}
                  labels={Object.keys(pollutants)}
                  legend
                  backgroundColor={"#f8000087"}
                />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

const AqiLevel = ({ value, unit, parameter, color }) => (
  <div className="aqi-level">
    <ProgressBar
      bgColor={color}
      completed={value}
      maxCompleted={100}
      customLabel=" "
    />
    <p>
      {parameter}: {value} {unit}
    </p>
  </div>
);

export default Dashboard;
