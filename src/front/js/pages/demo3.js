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
  const [headerName, setHeaderName] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = ()=>{
    navigate('/demo3/showproperties')
  }

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
    }  else {
      throw new Error("Unsupported file type.");
    }
  };

  const fetchParcelData = async (parcelNumber) => {
    try {
      const response = await fetch(
        `https://app.regrid.com/api/v2/parcels/apn?parcelnumb=${parcelNumber}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM3NDA2MzU3LCJleHAiOjE3Mzk5OTgzNTcsInUiOjQ4NjA5NCwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.v3e_UqErozcxQm_1Tsn81KYcUoWQituBYJsO4z3F9c8`
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
      const rows = await parseFileContent(file); // Lee el contenido del archivo
      const headers = rows[0]; // Obtén los encabezados
      const headerIndex = headers.indexOf(headerName.trim()); // Encuentra el índice del encabezado relevante
  
      if (headerIndex === -1) {
        setLoading(false);
        return Swal.fire("Header not found in the file.", "", "error");
      }
  
      const parcelNumbers = rows
        .slice(1) // Omite el encabezado
        .map((row) => row[headerIndex]?.toString().trim()) // Extrae los números de parcela
        .filter((num) => /^[0-9]+$/.test(num)); // Filtra números válidos
  
      if (!parcelNumbers.length) {
        setLoading(false);
        return Swal.fire("No valid parcel numbers found.", "", "error");
      }
  
      const parcels = await Promise.all(parcelNumbers.map(fetchParcelData)); // Fetch de datos de las parcelas
      const validParcels = parcels.filter(Boolean); // Filtra las parcelas válidas
      setParcelDataList(validParcels); // Almacena las parcelas en el estado
  
      await actions.uploadParcels(validParcels); // Envía al backend
      Swal.fire(
        "File processed successfully!",
        `Fetched data for ${validParcels.length} parcels.`,
        "success"
      );
    } catch (error) {
      Swal.fire("Failed to process the file.", error.message, "error");
    } finally {
      setLoading(false);
      setFile(null); // Reinicia el archivo
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
            <input className="title" type="file" onChange={handleFileChange}/>
            {file ? file.name : "Choose a file to add properties"}
          </label>
        </div>
        <div className="d-flex m-auto justify-content-center">
          <div className="header-input-container">
            <input
              type="text"
              placeholder={isFocused ? "" : "Parcel header"}
              value={headerName}
              onChange={(e) => setHeaderName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="header-input"
              title="Header column name"
            />
          </div>
          {/*<button type="submit" className="upload-button" disabled={loading}>
          {loading ? "Processing..." : "Upload and Fetch"}
        </button>*/}
          <button
            type="submit"
            className="container-btn-file"
            disabled={loading}
            title="Upload file"
            >
            {loading ? "Processing..." : <i className="fa-solid fa-upload"></i>}
          </button>   
        </div>
        <button className="go-to-properties" onClick={handleClick} >See all properties</button>
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
                  {Object.keys(headerMapping).map((key) => {
                    const value = parcel.properties.fields[key] || "N/A";

                    // Detecta si la celda es latitud o longitud
                    if (key === "lat" || key === "lon") {
                      const lat = parcel.properties.fields.lat;
                      const lon = parcel.properties.fields.lon;

                      // Verifica que ambos valores existan para crear el enlace
                      if (lat && lon) {
                        return (
                          <td key={key}>
                            <a
                              href={`https://www.google.com/maps?q=${lat},${lon}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "blue",
                                textDecoration: "none",
                              }}
                            >
                              {value}
                            </a>
                          </td>
                        );
                      }
                    }

                    // Renderiza las demás celdas normales
                    return <td key={key}>{value}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
