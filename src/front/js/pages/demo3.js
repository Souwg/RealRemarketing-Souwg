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

  const handleFileChange = (event) => setFile(event.target.files[0]);

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

  const fetchParcelByNumber = async (parcelNumber) => {
    try {
      const response = await fetch(
        `https://app.regrid.com/api/v2/parcels/apn?parcelnumb=${parcelNumber}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM3NDA2MzU3LCJleHAiOjE3Mzk5OTgzNTcsInUiOjQ4NjA5NCwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.v3e_UqErozcxQm_1Tsn81KYcUoWQituBYJsO4z3F9c8`
      );
      if (!response.ok) throw new Error(`Failed to fetch parcel: ${parcelNumber}`);
      const data = await response.json();
      return data.parcels?.features[0] || null;
    } catch {
      return null;
    }
  };

  const fetchParcelByAddress = async (address) => {
    try {
      const response = await fetch(
        `https://app.regrid.com/api/v2/parcels/address?query=${encodeURIComponent(
          address
        )}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM3NDA2MzU3LCJleHAiOjE3Mzk5OTgzNTcsInUiOjQ4NjA5NCwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.v3e_UqErozcxQm_1Tsn81KYcUoWQituBYJsO4z3F9c8`
      );
      if (!response.ok) throw new Error(`Failed to fetch parcel by address: ${address}`);
      const data = await response.json();
      return data.parcels?.features[0] || null;
    } catch {
      return null;
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) return Swal.fire("Please select a file.", "", "warning");
  
    setLoading(true);
    try {
      const rows = await parseFileContent(file);
  
      if (rows.length < 2) {
        throw new Error("The file is empty or has no data rows.");
      }
  
      const headers = rows[0].map((header) => (header ? header.trim().toLowerCase() : ""));
      const dataRows = rows.slice(1); // Filas de datos
  
      let ignoredParcels = []; // Registro de parcelas ignoradas
      let parcels = [];
  
      for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
        const row = dataRows[rowIndex];
        let parcelNumber = null;
        let address = null;
        let latitude = null;
        let longitude = null;
  
        row.forEach((cell, columnIndex) => {
          const value = cell?.trim();
          if (!value) return;
  
          // Detectar número de parcela (más permisivo)
          if (!parcelNumber && /^[a-zA-Z0-9-()_\s]*$/.test(value)) {
            parcelNumber = value.trim();
          }
  
          // Detectar dirección (basado en encabezados)
          if (!address && headers[columnIndex]?.includes("address")) {
            address = value.trim();
          }
  
          // Detectar latitud y longitud
          if (/^-?\d+(\.\d+)?$/.test(value)) {
            if (!latitude && value >= -90 && value <= 90) latitude = parseFloat(value);
            else if (!longitude && value >= -180 && value <= 180) longitude = parseFloat(value);
          }
        });
  
        // Prioridad de búsqueda: Parcel Number -> Lat/Lon -> Address
        let parcel = null;
        if (parcelNumber) {
          console.log(`Row ${rowIndex + 1}: Searching by Parcel Number: ${parcelNumber}`);
          parcel = await fetchParcelByNumber(parcelNumber);
        }
  
        if (!parcel && latitude && longitude) {
          console.log(`Row ${rowIndex + 1}: Searching by Lat/Lon: ${latitude}, ${longitude}`);
          parcel = await fetchParcelByLatLon(latitude, longitude);
        }
  
        if (!parcel && address) {
          console.log(`Row ${rowIndex + 1}: Searching by Address: ${address}`);
          parcel = await fetchParcelByAddress(address);
        }
  
        if (parcel) {
          parcels.push(parcel);
        } else {
          console.warn(`Row ${rowIndex + 1}: No valid data found.`);
          ignoredParcels.push({ rowIndex: rowIndex + 1, parcelNumber, latitude, longitude, address });
        }
      }
  
      const validParcels = parcels.filter(Boolean);
  
      if (validParcels.length === 0) {
        console.warn("Ignored Parcels:", ignoredParcels);
        setLoading(false);
        return Swal.fire(
          "No valid parcels found.",
          "The file does not contain valid parcel data.",
          "info"
        );
      }
  
      console.log("Ignored Parcels:", ignoredParcels);
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
      setFile(null); // Reiniciar el archivo
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
