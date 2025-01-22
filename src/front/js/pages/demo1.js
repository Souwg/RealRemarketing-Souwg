/*
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import "../../styles/demo1.css";

export const DemoOne = () => {
  const { actions } = useContext(Context);
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await actions.deleteAllFiles(); // Llama la acción para eliminar los archivos
          setFiles([]); // Actualiza el estado de 'files' a un array vacío
          Swal.fire({
            title: "Deleted!",
            text: "Your files have been deleted.",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "There was a problem deleting the files.",
          });
        }
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
        text: "Please select a file.",
      });
      return;
    }
    try {
      // Llamar al método actions.uploadFile y manejar errores
      await actions.uploadFile(file);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `The file ${file.name} has been successfully uploaded.`,
      });
    } catch (error) {
      // Mostrar un mensaje de error si ocurre un problema, como un archivo duplicado
      Swal.fire({
        icon: "error",
        title: "This file is already registered.",
        text: error.message,
      });
    }
  };
  useEffect(() => {
    // Obtener la lista de archivos al cargar el componente
    const fetchFiles = async () => {
      const fileList = await actions.getAllFiles();
      setFiles(fileList);
    };
    fetchFiles();
  }, [actions]);
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
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
            </button>
            {menuOpen && (
              <div
                className="menu-dropdown"
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
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
      <div className="file-table-container">
        <h2>Uploaded Files</h2>
        {files.length > 0 ? (
          <table className="file-table">
            <thead>
              <tr>
                <th>Acres</th>
                <th>County</th>
                <th>Owner</th>
                <th>Parcel</th>
                <th>Range</th>
                <th>Section</th>
                <th>StartingBid</th>
                <th>State</th>
                <th>Township</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td>{file.Acres}</td>
                  <td>{file.County}</td>
                  <td>{file.Owner}</td>
                  <td>{file.Parcel}</td>
                  <td>{file.Range}</td>
                  <td>{file.Section}</td>
                  <td>{file.StartingBid}</td>
                  <td>{file.State}</td>
                  <td>{file.Township}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
};
*/
