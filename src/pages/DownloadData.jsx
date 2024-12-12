import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const api = "https://sih.anujg.me/csv/hw/";

const DownloadData = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  const handleDownload = () => {
    if (!selectedDeviceId) {
      alert('Please select a device ID before downloading.');
      return;
    }

    const downloadUrl = `${api}${selectedDeviceId}`;
    window.location.href = downloadUrl;
  };

  return (
    <div
      className="admin-container"
    >
      <AdminSidebar />
      <div
        className="download-data-container"
        style={{
          textAlign: 'center',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '10px',
          // backgroundColor: '#fff', // White background for form
          // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>
          Download Hardware Sensor AQI Data
        </h2>
        <div
          className="download-options"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <label htmlFor="deviceId" style={{ marginBottom: '10px' }}>
            Select Device ID:
          </label>
          <select
            id="deviceId"
            name="deviceId"
            className="device-id-select"
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginBottom: '20px',
              width: '200px',
              textAlign: 'center',
            }}
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
          >
            <option value="">-- Select Device --</option>
            <option value="TTI-01">TTI-01</option>
            <option value="TTI-02">TTI-02</option>
            <option value="TTI-03">TTI-03</option>
            <option value="TTI-04">TTI-04</option>
            <option value="TTI-05">TTI-05</option>
            <option value="TTI-06">TTI-06</option>
            <option value="TTI-07">TTI-07</option>
          </select>
          <button
            className="download-btn"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            onClick={handleDownload}
          >
            Download Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadData;
