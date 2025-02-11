import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

export const ExcelToCSVConverter = () => {
  const { store, actions } = useContext(Context);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Excel to CSV Converter</h2>
      <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
      <button onClick={handleConvert}>Convert to CSV</button>
      {store.uploadedFile && (
        <button onClick={handleDownload} style={{ marginTop: "10px" }}>
          Download CSV
        </button>
      )}
    </div>
  );
};
