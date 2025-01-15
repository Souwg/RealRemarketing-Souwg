import React, { useState } from "react";
import Swal from "sweetalert2";
import "../../styles/demo2.css";

export const DemoNumberTwo = () => {
  const [file, setFile] = useState(null);
  const [parcelDataList, setParcelDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [headerName, setHeaderName] = useState("");

  const headerMapping = {
    parcelnumb: "Parcel Number",
    owner: "Owner",
    zoning: "Zoning",
    yearbuilt: "Year Built",
    improvval: "Improvement Value",
    landval: "Land Value",
    parval: "Parcel Value",
    mailadd: "Mail Address",
    mail_city: "Mail City",
    mail_state2: "Mail State",
    mail_zip: "Mail Zip",
    mail_country: "Mail Country",
    address: "Address",
    lat: "Latitude",
    lon: "Longitude",
    ll_gisacre: "Acre",
    ll_gissqft: "Acre SQFT",
  };

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const fetchParcelData = async (parcelNumber) => {
    try {
      const response = await fetch(
        `https://app.regrid.com/api/v2/parcels/apn?parcelnumb=${parcelNumber}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM0OTExMTMwLCJleHAiOjE3Mzc1MDMxMzAsInUiOjIyMjE5NywiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.tDZnEGoX7BXvYyA3KpHrya1SQCkBRKCuN375fK4GhAs`
      );
      if (!response.ok) throw new Error(`Failed to fetch parcel: ${parcelNumber}`);
      const data = await response.json();
      return data.parcels?.features[0] || null;
    } catch {
      return null;
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) return Swal.fire("Please select a file.", "", "warning");
    if (!headerName) return Swal.fire("Please specify the column header for parcel numbers.", "", "warning");

    setLoading(true);
    const content = await file.text();
    const lines = content.split("\n");
    const headers = lines[0].split(",");
    const headerIndex = headers.indexOf(headerName.trim());

    if (headerIndex === -1) {
      setLoading(false);
      return Swal.fire("Header not found in the file.", "", "error");
    }

    const parcelNumbers = lines.slice(1).map((line) => line.split(",")[headerIndex]?.trim()).filter((num) => /^[0-9]+$/.test(num));

    if (!parcelNumbers.length) {
      setLoading(false);
      return Swal.fire("No valid parcel numbers found.", "", "error");
    }

    const parcels = await Promise.all(parcelNumbers.map(fetchParcelData));
    setParcelDataList(parcels.filter(Boolean));
    setLoading(false);

    Swal.fire("File processed successfully!", `Fetched data for ${parcels.length} parcels.`, "success");
  };

  return (
    <div className="upload-and-parcel-container">
      <form onSubmit={handleFileUpload} className="upload-form">
        <div className="file-input-container">
          <input type="file" onChange={handleFileChange} className="file-input" />
          <label className="file-label">{file ? file.name : "Click to browse a file"}</label>
        </div>
        <div className="header-input-container">
          <input
            type="text"
            placeholder="Enter parcel number column header"
            value={headerName}
            onChange={(e) => setHeaderName(e.target.value)}
            className="header-input"
          />
        </div>
        <button type="submit" className="upload-button" disabled={loading}>
          {loading ? "Processing..." : "Upload and Fetch"}
        </button>
      </form>

      {parcelDataList.length > 0 && (
        <div className="parcel-table-container">
          <h3>Properties data</h3>
          <table className="parcel-table">
            <thead>
              <tr>
                {Object.keys(headerMapping).map((key) => (
                  <th key={key}>{headerMapping[key]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parcelDataList.map((parcel, index) => (
                <tr key={index}>
                  {Object.keys(headerMapping).map((key) => (
                    <td key={key}>{parcel.properties.fields[key] || "N/A"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
