import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/Graph_data.css";
import AdminSidebar from "../components/AdminSidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const api = "https://sih.anujg.me/fetch/bhopal/history";

const Graph_data = () => {
  const [timeframe, setTimeframe] = useState("weekly");
  const [aqiData, setAqiData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data for monthly and yearly trends
  const dummyData = {
    monthly: Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      value: Math.floor(Math.random() * 5000) + 1000,
    })),
    yearly: Array.from({ length: 5 }, (_, i) => ({
      year: `Year ${2020 + i}`,
      value: Math.floor(Math.random() * 20000) + 5000,
    })),
  };

  // Fetch AQI data from API for weekly timeframe
  useEffect(() => {
    if (timeframe === "weekly") {
      const fetchData = async () => {
        try {
          const response = await fetch(api);
          const data = await response.json();

          // Parse the weekly data from the response
          const weeklyData = processWeeklyData(data.Table.Data);
          setAqiData(weeklyData);
        } catch (error) {
          console.error("Error fetching AQI data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      // Use dummy data for monthly and yearly
      setAqiData(dummyData[timeframe]);
      setLoading(false);
    }
  }, [timeframe]);

  // Process and divide weekly data into weeks
  const processWeeklyData = (data) => {
    const { averageArray, timeArray } = data;
    const weeklyData = [];

    // Group data by weeks (7-day intervals)
    for (let i = 0; i < averageArray.length; i += 7) {
      const weekValues = averageArray.slice(i, i + 7);
      const weekStartDate = new Date(timeArray[i]);
      const weekEndDate = new Date(timeArray[Math.min(i + 6, timeArray.length - 1)]);

      const average = (
        weekValues.reduce((sum, value) => sum + value, 0) / weekValues.length
      ).toFixed(2);

      weeklyData.push({
        week: `${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`,
        value: parseFloat(average),
      });
    }

    return weeklyData;
  };

  // Generate data for the chart
  const generateChartData = () => {
    return {
      labels: aqiData.map((data) =>
        timeframe === "weekly" ? data.week : timeframe === "monthly" ? data.month : data.year
      ),
      datasets: [
        {
          label: `AQI Data (${timeframe})`,
          data: aqiData.map((data) => data.value),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4, // Curve for smooth lines
          borderWidth: 2,
        },
      ],
    };
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="graph-container">
        <h1>AQI Monitoring - Graph View</h1>

        {/* Timeframe Buttons */}
        <div className="timeframe-buttons">
          {["weekly", "monthly", "yearly"].map((frame) => (
            <button
              key={frame}
              className={`timeframe-button ${frame === timeframe ? "active" : ""}`}
              onClick={() => {
                setLoading(true);
                setTimeframe(frame);
              }}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="graph-chart-container">
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <Line
              data={generateChartData()}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: timeframe === "weekly" ? "Weeks" : timeframe === "monthly" ? "Months" : "Years",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "AQI Values",
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Graph_data;
