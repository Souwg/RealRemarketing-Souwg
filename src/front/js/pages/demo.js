import React, { useState } from "react";
import "../../styles/demo.css"

export const Demo = () => {
  const [parcelNumber, setParcelNumber] = useState("");
  const [parcelData, setParcelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    setParcelNumber(event.target.value);
  };

  const fetchParcelData = async () => {
    setLoading(true);
    setError("");
    setParcelData(null);

    try {
      const response = await fetch(
        `https://app.regrid.com/api/v2/parcels/apn?parcelnumb=${parcelNumber}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM0OTExMTMwLCJleHAiOjE3Mzc1MDMxMzAsInUiOjIyMjE5NywiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.tDZnEGoX7BXvYyA3KpHrya1SQCkBRKCuN375fK4GhAs`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch parcel data.");
      }

      const data = await response.json();
      if (data.parcels.features.length === 0) {
        throw new Error("No parcel found with the provided number.");
      }

      setParcelData(data.parcels.features[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parcel-info-container">
      <h2>Parcel Information</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Parcel Number (APN)"
          value={parcelNumber}
          onChange={handleInputChange}
          className="parcel-input"
        />
        <button onClick={fetchParcelData} className="fetch-button">
          Parcel Info
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p className="error-message">{error}</p>}

      {parcelData && (
        <div className="parcel-table-container">
          <table className="parcel-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(parcelData.properties.fields).map(
                ([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
