import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import "../../styles/admin.css";

export const FileUpload = () => {
  const { actions } = useContext(Context);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please select a file.",
      });
      return;
    }
    actions.uploadFile(file);
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `The file ${file.name} has been successfully uploaded.`,
    });
  };

  return (
    <div className="center-container">
      <form className="modern-file-upload-form" onSubmit={handleSubmit}>
        <div className="upload-container">
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {file ? `Archivo seleccionado: ${file.name}` : "Haz clic o arrastra un archivo aquí"}
          </label>
        </div>
        <button type="submit" className="modern-button">
          Subir Archivo
        </button>
      </form>
    </div>
  );
};
