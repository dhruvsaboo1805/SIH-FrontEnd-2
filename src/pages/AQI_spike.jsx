import React from "react";
import "../styles/AQI_spike.css";
import { useState } from "react";

const aqiData = [
    { id: 1, area: "Delhi", aqi: 250, status: "Pending" },
    { id: 2, area: "Mumbai", aqi: 90, status: "Resolved" },
    { id: 3, area: "Kolkata", aqi: 180, status: "Pending" },
    { id: 4, area: "Bangalore", aqi: 120, status: "Resolved" },
    { id: 5, area: "Chennai", aqi: 200, status: "Pending" },
    { id: 6, area: "Hyderabad", aqi: 75, status: "Resolved" },
    { id: 7, area: "Ahmedabad", aqi: 160, status: "Pending" },
    { id: 8, area: "Pune", aqi: 110, status: "Resolved" },
    { id: 9, area: "Jaipur", aqi: 190, status: "Pending" },
    { id: 10, area: "Lucknow", aqi: 140, status: "Resolved" },
  ];
  

// Dummy Employee Data
const employees = [
  { id: 1, name: "Amaan Hussain Jila Adhyaksh ji of Village 1" },
  { id: 2, name: "Dhruv Saboo Sachiv ji of Village 2" },
  { id: 3, name: "Anuj Gupta Pradhan ji of Village 3" },
];

const AQI_spike = () => {
  const [data, setData] = useState(aqiData);
  const [selectedArea, setSelectedArea] = useState(null);
  const [assignedEmployee, setAssignedEmployee] = useState(null);

  // Handle Action Button Click
  const handleActionClick = (area) => {
    setSelectedArea(area);
  };

  // Handle Employee Assignment
  const handleAssignEmployee = () => {
    if (selectedArea && assignedEmployee) {
      const updatedData = data.map((item) =>
        item.id === selectedArea.id
          ? { ...item, status: "Resolved", assignedTo: assignedEmployee.name }
          : item
      );
      setData(updatedData);
      setSelectedArea(null);
      setAssignedEmployee(null);
    }
  };

  return (
    <div className="app-container">
      <h1>AQI Monitoring Dashboard</h1>

      <table className="aqi-table">
        <thead>
          <tr>
            <th>Area</th>
            <th>AQI</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.area}</td>
              <td className={item.aqi > 150 ? "high-aqi" : "low-aqi"}>
                {item.aqi}
              </td>
              <td>{item.status}</td>
              <td>
                {item.status === "Pending" && (
                  <button
                    className="action-button"
                    onClick={() => handleActionClick(item)}
                  >
                    Take Action
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Employee Assignment */}
      {selectedArea && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Assign Employee for {selectedArea.area}</h2>

            <div className="employee-list">
              {employees.map((employee) => (
                <div key={employee.id} className="employee-item">
                  <input
                    type="radio"
                    id={employee.id}
                    name="employee"
                    value={employee.name}
                    onChange={() => setAssignedEmployee(employee)}
                  />
                  <label htmlFor={employee.id}>{employee.name}</label>
                </div>
              ))}
            </div>

            <button className="assign-button" onClick={handleAssignEmployee}>
              Assign
            </button>

            <button
              className="cancel-button"
              onClick={() => setSelectedArea(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AQI_spike;
