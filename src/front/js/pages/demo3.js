import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/demo3.css";
import { Context } from "../store/appContext";

export const DemoThree = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [parcelDataList, setParcelDataList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const parseFileContent = async (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      const content = await file.text();
      const lines = content.split("\n");
      return lines.map((line) => line.split(","));
    } else {
      throw new Error("Unsupported file type.");
    }
  };

  const validateFileContent = (rows) => {
    if (!rows || rows.length < 2) {
      throw new Error("The file is empty or improperly formatted.");
    }
    return true;
  };

  const fetchParcelByNumber = async (parcelNumber) => {
    try {
      const response = await fetch(
        `https://app.regrid.com/api/v2/parcels/apn?parcelnumb=${parcelNumber}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM3Njg5MDUwLCJleHAiOjE3NDAyODEwNTAsInUiOjQ4NzI5MCwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.LCESilMr2HeYDj4ki5nNVSAQ5rqYobOkkTj5WS8ZQ_c`
      );
      if (!response.ok) throw new Error(`Failed to fetch parcel: ${parcelNumber}`);
      const data = await response.json();
      return data.parcels?.features[0] || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchParcelByAddress = async (address) => {
    try {
      const response = await fetch(
        `https://app.regrid.com/api/v2/parcels/address?query=${encodeURIComponent(
          address
        )}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM3Njg5MDUwLCJleHAiOjE3NDAyODEwNTAsInUiOjQ4NzI5MCwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.LCESilMr2HeYDj4ki5nNVSAQ5rqYobOkkTj5WS8ZQ_c`
      );
      if (!response.ok) throw new Error(`Failed to fetch parcel by address: ${address}`);
      const data = await response.json();
      return data.parcels?.features[0] || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchParcelByLatLon = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://app.regrid.com/api/v2/parcels/coordinates?lat=${latitude}&lon=${longitude}&token=YOUR_API_TOKEN`
      );
      if (!response.ok) throw new Error(`Failed to fetch parcel at coordinates (${latitude}, ${longitude})`);
      const data = await response.json();
      return data.parcels?.features[0] || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  
  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) return Swal.fire("Please select a file.", "", "warning");
  
    setLoading(true);
    try {
      const rows = await parseFileContent(file);
      validateFileContent(rows);
  
      const headers = rows[0].map((header) => (header ? header.trim().toLowerCase() : ""));
      console.log("File Headers:", headers);
  
      const dataRows = rows.slice(1);
  
      const parcels = await Promise.all(
        dataRows.map(async (row, rowIndex) => {
          let parcelNumber = null;
          let address = null;
          let latitude = null;
          let longitude = null;
  
          row.forEach((cell, columnIndex) => {
            const value = cell?.trim();
            console.log(`Row ${rowIndex + 1}, Column ${columnIndex}: ${value}`);
            if (!value) return;
  
            // Aceptar cualquier tipo de texto para el número de parcela
            if (!parcelNumber) {
              parcelNumber = value; // No restricciones, cualquier texto es válido
            }
  
            // Aceptar cualquier dirección que esté en el encabezado address
            if (headers[columnIndex]?.includes("address") && !address) {
              address = value; // No restricciones, cualquier texto es válido
            }
  
            // Aceptar cualquier valor numérico o flotante para latitud y longitud
            if (!latitude && !isNaN(value) && value >= -90 && value <= 90) {
              latitude = parseFloat(value);
            } else if (!longitude && !isNaN(value) && value >= -180 && value <= 180) {
              longitude = parseFloat(value);
            }
          });
  
          console.log(`Row ${rowIndex + 1} - Parsed Data:`, {
            parcelNumber,
            address,
            latitude,
            longitude,
          });
  
          // Intentar buscar datos con cualquier dato disponible
          if (parcelNumber) {
            const parcel = await fetchParcelByNumber(parcelNumber);
            if (parcel) return parcel;
          }
          if (latitude && longitude) {
            const parcel = await fetchParcelByLatLon(latitude, longitude);
            if (parcel) return parcel;
          }
          if (address) {
            const parcel = await fetchParcelByAddress(address);
            if (parcel) return parcel;
          }
  
          console.warn(`No valid parcel data found for row ${rowIndex + 1}`);
          return null;
        })
      );
  
      const validParcels = parcels.filter(Boolean);
      console.log("Valid Parcels:", validParcels);
  
      if (validParcels.length === 0) {
        setLoading(false);
        return Swal.fire(
          "No valid parcels found.",
          "The file does not contain valid parcel data.",
          "info"
        );
      }
  
      setParcelDataList(validParcels);
      await actions.uploadParcels(validParcels);
      Swal.fire(
        "File processed successfully!",
        `Fetched data for ${validParcels.length} parcels.`,
        "success"
      );
    } catch (error) {
      console.error("Error during processing:", error);
      Swal.fire("Failed to process the file.", error.message, "error");
    } finally {
      setLoading(false);
      setFile(null);
      document.querySelector('input[type="file"]').value = ""; // Resetear input
    }
  };


  return (
    <div className="upload-and-parcel-container">
      <form onSubmit={handleFileUpload} className="upload-form">
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
            {file ? file.name : "Choose a file to add properties"}
          </label>
        </div>
        <div className="d-flex m-auto justify-content-center">
          <button
            type="submit"
            className="container-btn-file-upload"
            disabled={loading}
            title="Upload file"
          >
            {loading ? "Processing..." : <i className="fa-solid fa-upload"></i>}
          </button>
        </div>
        <button
          onClick={() => navigate("/demo3/showproperties")}
          className="button-go"
        >
          See all properties
          <ion-icon
            name="arrow-forward-outline"
            style={{ fontSize: "40px", verticalAlign: "middle" }}
          ></ion-icon>
        </button>
      </form>
      {parcelDataList.length > 0 && (
        <div className="parcel-table-container">
          <h3>Properties data</h3>
          <table className="parcel-table">
            <thead>
              <tr>
                {Object.values(headerMapping).map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parcelDataList.map((parcel, index) => (
                <tr key={index}>
                  {Object.keys(headerMapping).map((key) => (
                    <td key={key}>
                      {parcel.properties.fields[key] || "N/A"}
                    </td>
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
