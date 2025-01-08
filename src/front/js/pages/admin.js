import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import "../../styles/admin.css";

export const FileUpload = () => {
  const { actions } = useContext(Context);
  const [file, setFile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        actions.deleteAllFiles();
        Swal.fire({
          title: "Deleted!",
          text: "Your files have been deleted.",
          icon: "success"
        });
      }
    });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please select a file."
      });
      return;
    }
    try {
      // Llamar al método actions.uploadFile y manejar errores
      await actions.uploadFile(file);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `The file ${file.name} has been successfully uploaded.`
      });
    } catch (error) {
      // Mostrar un mensaje de error si ocurre un problema, como un archivo duplicado
      Swal.fire({
        icon: "error",
        title: "This file is already registered.",
        text: error.message
      });
    }
  };

  return (
    <div className="upload-container">
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="file-input-container">
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {file ? `Selected file: ${file.name}` : "Click or drag a file here"}
          </label>
        </div>
        <div className="button-container">
          <button type="submit" className="upload-button">
            Upload File
          </button>
          <div className="menu-container">
            <button
              type="button"
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            {menuOpen && (
              <div className="menu-dropdown">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="menu-item"
                >
                  Delete All Records
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
