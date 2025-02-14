import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/convert.css";

export const ExcelToCSVConverter = () => {
  const { store, actions } = useContext(Context);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name); // Guardar el nombre del archivo
    }
  };

  const handleConvert = async () => {
    if (file) {
      await actions.uploadAndConvertExcel(file);
    } else {
      alert("Please select an Excel file.");
    }
  };

  const handleDownload = () => {
    if (store.uploadedFile) {
      const url = window.URL.createObjectURL(store.uploadedFile);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "converted_file.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Reiniciar el estado después de descargar
      setFile(null);
      setFileName("");
      actions.clearUploadedFile(); // Si tienes una acción para limpiar el archivo subido
    }
  };

  return (
    <div className="converter-container">
      <h2>Excel to CSV Converter</h2>
      <label htmlFor="file-input">Choose File</label>
      <input
        id="file-input"
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
      />
      {fileName && <p className="file-name">Selected file: {fileName}</p>}
      <button onClick={handleConvert}>Convert to CSV</button>
      {store.uploadedFile && (
        <button className="download-btn" onClick={handleDownload}>
          Download CSV
        </button>
      )}
    </div>
  );
};
