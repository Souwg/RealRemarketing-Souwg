import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "../../styles/demo3.css";
import { Context } from "../store/appContext";

export const DemoThree = () => {
  const { actions } = useContext(Context);
  const [file, setFile] = useState(null);
  const [parcelDataList, setParcelDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [headerName, setHeaderName] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const headerMapping = {
    parcelnumb: "Parcel Number",
    owner: "Owner",
    zoning: "Zoning",
    yearbuilt: "Year built",
    improvval: "Improvement value",
    landval: "Land value",
    parval: "Parcel value",
    mailadd: "Mail address",
    mail_city: "Mail city",
    mail_state2: "Mail state",
    mail_zip: "Mail zip",
    mail_country: "Mail country",
    address: "Address",
    state2: "State",
    county: "County",
    szip: "Zip code",
    ll_bldg_footprint_sqft: "Building footprint area SQFT",
    ll_bldg_count: "Building count",
    fema_flood_zone_raw: "Fema flood zone",
    legaldesc: "Legal description",
    lat: "Latitude",
    lon: "Longitude",
    ll_gisacre: "Acre",
    ll_gissqft: "Acre SQFT",
  };

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const parseFileContent = async (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      const content = await file.text();
      const lines = content.split("\n");
      return lines.map((line) => line.split(","));
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    } else {
      throw new Error("Unsupported file type.");
    }
  };

  const fetchParcelData = async (parcelNumber) => {
    try {
      const response = await fetch(
        `https://app.regrid.com/api/v2/parcels/apn?parcelnumb=${parcelNumber}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM2NDQzNDU4LCJleHAiOjE3MzkwMzU0NTgsInUiOjQ4MjQxNSwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.GxFicvA7XmyTh2uIIgJ-HwqN1NT3eQ6NArT1KkbrAT4`
      );
      if (!response.ok)
        throw new Error(`Failed to fetch parcel: ${parcelNumber}`);
      const data = await response.json();
      return data.parcels?.features[0] || null;
    } catch {
      return null;
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) return Swal.fire("Please select a file.", "", "warning");
    if (!headerName)
      return Swal.fire(
        "Please specify the column header for parcel numbers.",
        "",
        "warning"
      );

    setLoading(true);
    try {
      const rows = await parseFileContent(file);
      const headers = rows[0];
      const headerIndex = headers.indexOf(headerName.trim());

      if (headerIndex === -1) {
        setLoading(false);
        return Swal.fire("Header not found in the file.", "", "error");
      }

      const parcelNumbers = rows
        .slice(1)
        .map((row) => row[headerIndex]?.toString().trim())
        .filter((num) => /^[0-9]+$/.test(num));

      if (!parcelNumbers.length) {
        setLoading(false);
        return Swal.fire("No valid parcel numbers found.", "", "error");
      }

      const parcels = await Promise.all(parcelNumbers.map(fetchParcelData));
      const validParcels = parcels.filter(Boolean);
      setParcelDataList(validParcels);

      await actions.uploadParcels(validParcels);
      Swal.fire(
        "File processed successfully!",
        `Fetched data for ${validParcels.length} parcels.`,
        "success"
      );
    } catch (error) {
      Swal.fire("Failed to process the file.", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-and-parcel-container">
      <form onSubmit={handleFileUpload} className="upload-form">
        {/*<div className="file-input-container">
          <input type="file" onChange={handleFileChange} className="file-input" />
          <label className="file-label">{file ? file.name : "Click to browse a file"}</label>
        </div>*/}
        <div className="container">
          <div className="folder">
            <div className="front-side">
              <div className="tip"></div>
              <div className="cover"></div>
            </div>
            <div className="back-side cover"></div>
          </div>
          <label className="custom-file-upload">
            <input className="title" type="file" onChange={handleFileChange} />
            {file ? file.name : "Choose a file"}
          </label>
        </div>
        <div className="d-flex justify-content-center">
        <div className="header-input-container">
          <input
            type="text"
            placeholder={isFocused ? "" : "Parcel header"}
            value={headerName}
            onChange={(e) => setHeaderName(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="header-input"
          />
        </div>
        {/*<button type="submit" className="upload-button" disabled={loading}>
          {loading ? "Processing..." : "Upload and Fetch"}
        </button>*/}
        <button type="submit" className="container-btn-file" disabled={loading}>
        {loading ? "Processing..." : <i class="fa-solid fa-upload"></i>}
        </button>
      </div>
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
