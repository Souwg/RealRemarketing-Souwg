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
        `https://app.regrid.com/api/v2/parcels/apn?parcelnumb=${parcelNumber}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM4MTI2MjgxLCJleHAiOjE3NDA3MTgyODEsInUiOjQ4ODkzNCwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.XrC5wsvtWZGc_TxMnS4YNfy4uoj9gmWwcePhr6ixU_M`
      );
      if (!response.ok)
        throw new Error(`Failed to fetch parcel: ${parcelNumber}`);
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
        )}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM4MTI2MjgxLCJleHAiOjE3NDA3MTgyODEsInUiOjQ4ODkzNCwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.XrC5wsvtWZGc_TxMnS4YNfy4uoj9gmWwcePhr6ixU_M`
      );
      if (!response.ok)
        throw new Error(`Failed to fetch parcel by address: ${address}`);
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
        `https://app.regrid.com/api/v2/parcels/coordinates?lat=${latitude}&lon=${longitude}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM4MTI2MjgxLCJleHAiOjE3NDA3MTgyODEsInUiOjQ4ODkzNCwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.XrC5wsvtWZGc_TxMnS4YNfy4uoj9gmWwcePhr6ixU_M`
      );
      if (!response.ok)
        throw new Error(
          `Failed to fetch parcel at coordinates (${latitude}, ${longitude})`
        );
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

  const isValidAddress = (value) => {
    // Expresión regular mejorada para detectar direcciones complejas
    const addressRegex = /^\d+\s+[a-zA-Z0-9\s,.-]+/;
    return addressRegex.test(value);
  };

  const fetchParcelData = async (
    parcelNumber,
    address,
    latitude,
    longitude
  ) => {
    // 1. Buscar por número de parcela
    if (parcelNumber) {
      const parcelByNumber = await fetchParcelByNumber(parcelNumber);
      if (parcelByNumber) return parcelByNumber;
    }

    // 2. Buscar por dirección
    if (address) {
      const parcelByAddress = await fetchParcelByAddress(address);
      if (parcelByAddress) return parcelByAddress;
    }

    // 3. Buscar por latitud y longitud
    if (latitude && longitude) {
      const parcelByLatLon = await fetchParcelByLatLon(latitude, longitude);
      if (parcelByLatLon) return parcelByLatLon;
    }

    // Si no se encuentra nada, retornar null
    return null;
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) return Swal.fire("Please select a file.", "", "warning");

    setLoading(true);
    try {
      // Parsear el archivo CSV
      const rows = await parseFileContent(file);
      validateFileContent(rows);
      console.log("All Rows:", rows);

      // Obtener los encabezados del archivo
      const headers = rows[0].map((header) =>
        header ? header.trim().toLowerCase() : ""
      );
      console.log("File Headers:", headers);

      // Detectar automáticamente la columna de dirección
      const addressColumnIndex = headers.findIndex((header) =>
        header.includes("address")
      );

      // Procesar cada fila (omitir la primera fila de encabezados)
      const dataRows = rows.slice(1);

      const parcels = await Promise.all(
        dataRows.map(async (row, rowIndex) => {
          let parcelNumber = null;
          let address = null;
          let latitude = null;
          let longitude = null;

          // Recorrer cada celda de la fila
          row.forEach((cell, columnIndex) => {
            const value = cell?.trim();
            if (!value) return;

            // Buscar número de parcela (sin restricciones)
            if (!parcelNumber) {
              parcelNumber = value; // Aceptar cualquier valor no vacío como número de parcela
            }

            // Buscar dirección en la columna de dirección (si existe)
            if (
              addressColumnIndex !== -1 &&
              columnIndex === addressColumnIndex
            ) {
              address = value;
            }

            // Buscar dirección en cualquier celda (si no se encontró en la columna de dirección)
            if (!address && isValidAddress(value)) {
              address = value;
            }

            // Buscar latitud y longitud (valores numéricos dentro de rangos válidos)
            if (!latitude && !isNaN(value) && value >= -90 && value <= 90) {
              latitude = parseFloat(value);
            } else if (
              !longitude &&
              !isNaN(value) &&
              value >= -180 &&
              value <= 180
            ) {
              longitude = parseFloat(value);
            }
          });

          console.log(`Row ${rowIndex + 1} - Parsed Data:`, {
            parcelNumber,
            address,
            latitude,
            longitude,
          });

          // Buscar la parcela usando la función fetchParcelData
          const parcel = await fetchParcelData(
            parcelNumber,
            address,
            latitude,
            longitude
          );

          if (!parcel) {
            console.warn(`No valid parcel data found for row ${rowIndex + 1}`);
          }

          return parcel;
        })
      );

      // Filtrar parcelas válidas (eliminar nulls)
      const validParcels = parcels.filter(Boolean);
      console.log("Valid Parcels:", validParcels);

      // Mostrar mensaje si no se encontraron parcelas válidas
      if (validParcels.length === 0) {
        setLoading(false);
        return Swal.fire(
          "No valid parcels found.",
          "The file does not contain valid parcel data.",
          "info"
        );
      }

      // Actualizar el estado con las parcelas válidas
      setParcelDataList(validParcels);
      await actions.uploadParcels(validParcels);
      Swal.fire(
        "File processed successfully!",
        `Data for ${validParcels.length} parcels.`,
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
