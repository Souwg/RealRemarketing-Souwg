import React, { useState } from "react";
import "../../styles/demo2.css";
import dayrom from "../../fonts/DAYROM__.ttf"
import { text } from "@fortawesome/fontawesome-svg-core";

export const DemoTwo = () => {
  const [parcelNumber, setParcelNumber] = useState("");
  const [parcelData, setParcelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const titleStyle = {
    fontFamily: "dayrom1",
    fontSize: "3rem",
    textAlign: "center",
    fontWeight: "400",
    marginBottom: "0",
  };

  const handleInputChange = (event) => {
    setParcelNumber(event.target.value);
  };

  const fetchParcelData = async () => {
    setLoading(true);
    setError("");
    setParcelData(null);

    try {
      const response = await fetch(
        `https://app.regrid.com/api/v2/parcels/apn?parcelnumb=${parcelNumber}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM3NDA2MzU3LCJleHAiOjE3Mzk5OTgzNTcsInUiOjQ4NjA5NCwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.v3e_UqErozcxQm_1Tsn81KYcUoWQituBYJsO4z3F9c8`
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
      <style>
              {`
                @font-face {
                  font-family: 'dayrom1';
                  src: url(${dayrom}) format('truetype');
                }
              `}
            </style>
      <p style={titleStyle}>Parcels searching</p>
      <div className="container-search-parcel">
        <div className="search-container">
          <input className="input-parcel" type="text" value={parcelNumber} onChange={handleInputChange} placeholder={isFocused? "" : "parcel Number"} onFocus={()=>setIsFocused(true)} onBlur={()=>setIsFocused(false)} />
          <svg viewBox="0 0 24 24" class="search__icon" onClick={fetchParcelData}>
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
        </div>
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
