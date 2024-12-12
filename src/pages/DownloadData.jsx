import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const api = "https://sih.anujg.me/csv/hw/";

const DownloadData = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(''); // Selected device ID state

  const handleDownload = () => {
    if (!selectedDeviceId) {
      alert('Please select a device ID before downloading.');
      return;
    }

    const downloadUrl = `${api}${selectedDeviceId}`; // Build dynamic download URL
    window.location.href = downloadUrl; // Initiate download
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="download-data-container">
        <h2 style={{ marginBottom: '20px', marginLeft: 'calc(50% - 75px)' }}>
          Download Hardware Sensor AQI Data
        </h2>
        <div className="download-options" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <label htmlFor="deviceId" style={{ marginRight: '10px' }}>
            Select Device ID:
          </label>
          <select
            id="deviceId"
            name="deviceId"
            className="device-id-select"
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
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
            {/* Add more options for TTI-08 and TTI-09 if needed */}
          </select>
          <button
            className="download-btn"
            style={{
              marginLeft: '10px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
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