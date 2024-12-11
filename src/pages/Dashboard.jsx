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

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [pollutants, setPollutants] = useState({});
  const [city, setCity] = useState("bhopal");
  const [cityAqi, setCityAqi] = useState("");
  const [newCity, setNewCity] = useState("bhopal");
  const [lastCity, setLastCity] = useState("bhopal");

  // Function to fetch AQI data
  const fetchAqiData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://sih.anujg.me/fetch/${newCity}`);
      const data = response.data.data.cities[0];

      if (data && data.airComponents) {
        const airComponents = data.airComponents;

        const formattedPollutants = airComponents.reduce((acc, component) => {
          acc[component.senDevId] = component.sensorData || 0;
          return acc;
        }, {});

        setPollutants(formattedPollutants);
        setLastCity(newCity);
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

  // Function to calculate AQI from pollutant data
  const calculateAQI = (pollutantConcentration, breakpoints) => {
    const { C_low, C_high, I_low, I_high } = breakpoints;
    return (
      ((I_high - I_low) / (C_high - C_low)) *
        (pollutantConcentration - C_low) +
      I_low
    );
  };

  const getAQIBreakpoints = (pollutant, concentration) => {
    const breakpoints = {
      pm25: [
        { C_low: 0, C_high: 12, I_low: 0, I_high: 50 },
        { C_low: 12.1, C_high: 35.4, I_low: 51, I_high: 100 },
        { C_low: 35.5, C_high: 55.4, I_low: 101, I_high: 150 },
      ],
      pm10: [
        { C_low: 0, C_high: 54, I_low: 0, I_high: 50 },
        { C_low: 55, C_high: 154, I_low: 51, I_high: 100 },
        { C_low: 155, C_high: 254, I_low: 101, I_high: 150 },
      ],
      // Add more pollutant ranges as needed...
    };

    const bp = breakpoints[pollutant]?.find(
      (range) =>
        concentration >= range.C_low && concentration <= range.C_high
    );
    return bp;
  };

  const calculateOverallAQI = (pollutants) => {
    let highestAQI = 0;

    Object.keys(pollutants).forEach((pollutant) => {
      const concentration = pollutants[pollutant];
      const breakpoints = getAQIBreakpoints(pollutant, concentration);

      if (breakpoints) {
        const aqi = calculateAQI(concentration, breakpoints);
        if (aqi > highestAQI) {
          highestAQI = aqi;
        }
      }
    });

    return highestAQI;
  };

  // Fetch AQI data on city change
  useEffect(() => {
    fetchAqiData();
  }, [newCity]);

  // Calculate AQI whenever pollutant data updates
  useEffect(() => {
    if (pollutants) {
      setLoading(true);
      const overallAQI = calculateOverallAQI(pollutants);
      setCityAqi(overallAQI);
      setLoading(false);
    }
  }, [pollutants]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        <Bar city={newCity} setCity={setNewCity} fetchAqiData={fetchAqiData} />
        {loading ? (
          <Loader />
        ) : (
          <div className="aqi-content">
            <section className="widget-container">
              <WidgetItem
                data={Object.values(pollutants)}
                heading={`${city}`}
                aqi={cityAqi ? cityAqi.toFixed(2) : "N/A"}
              />
            </section>
            <section className="map-container">
              <div className="data">
                {Object.entries(pollutants).map(([key, value]) => (
                  <AqiLevel
                    key={key}
                    value={value}
                    unit="µg/m³"
                    parameter={key.toUpperCase()}
                    color={"#21ed15"} // Update with color logic if needed
                  />
                ))}
              </div>
              <PieChart
                data={Object.values(pollutants)}
                labels={Object.keys(pollutants)}
                backgroundColor={[
                  "#21ed15",
                  "#f2f11f",
                  "#fe714d",
                  "#FFC0CB",
                  "#de4df3",
                  "#da0e26",
                ]}
              />
              <LineChart
                data={Object.values(pollutants)}
                labels={Object.keys(pollutants)}
                legend
                backgroundColor={"#f8000087"}
              />
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
      className="wrapper"
      maxCompleted={100}
      customLabel=" "
    />
    <h3>
      {value} {unit}
    </h3>
    <p>{parameter}</p>
  </div>
);

export default Dashboard;
