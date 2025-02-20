import React, { useState, useEffect } from "react";
import "../../styles/properties.css";

export const ShowProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const openMapModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeMapModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/properties?timestamp=${new Date().getTime()}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // Combinar campos principales y adicionales sin duplicados
        const formattedProperties = data.map((property) => {
          const combinedData = { ...property }; // Copiar los datos principales

          // Agregar datos adicionales solo si no existen en los datos principales
          if (
            property.additional_data &&
            typeof property.additional_data === "object"
          ) {
            for (const key in property.additional_data) {
              if (!combinedData.hasOwnProperty(key)) {
                combinedData[key] = property.additional_data[key];
              }
            }
          }

          delete combinedData.additional_data; // Eliminar el campo additional_data
          return combinedData;
        });

        setProperties(formattedProperties);
        setError(null);
      } catch (err) {
        setError(
          err.message || "An error occurred while fetching the properties."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading)
    return (
      <div className="loader">
        <div>
          <ul>
            <li>
              <svg fill="currentColor" viewBox="0 0 90 120">
                <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
              </svg>
            </li>
            <li>
              <svg fill="currentColor" viewBox="0 0 90 120">
                <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
              </svg>
            </li>
            <li>
              <svg fill="currentColor" viewBox="0 0 90 120">
                <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
              </svg>
            </li>
          </ul>
        </div>
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  // Obtener todos los nombres de columnas (campos principales y adicionales)
  const allColumns = properties.reduce((columns, property) => {
    Object.keys(property).forEach((key) => {
      if (!columns.includes(key)) {
        columns.push(key);
      }
    });
    return columns;
  }, []);

  return (
    <div className="parcel-table-container">
      <h3 style={{ fontWeight: "600" }}>Properties List</h3>

      {properties.length > 0 ? (
        <table className="parcel-table">
          <thead>
            <tr>
              {/* Renderizar todas las columnas */}
              {allColumns.map((column) => (
                <th key={column}>{column.replace(/_/g, " ").toUpperCase()}</th>
              ))}
              <th>Map</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.parcel_number}>
                {/* Renderizar todas las columnas */}
                {allColumns.map((column) => {
                  const value = property[column];
                  const displayValue =
                    value === null || value === undefined || value === ""
                      ? "-" // Mostrar rayitas si el valor es nulo, undefined o vacío
                      : typeof value === "object"
                      ? JSON.stringify(value)
                      : value;

                  return <td key={column}>{displayValue}</td>;
                })}
                <td>
                  <button onClick={() => openMapModal(property)}>
                    View on Map
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", fontWeight: "600" }}>
          No properties available.
        </p>
      )}

      {/* Modal del mapa */}
      {isModalOpen && selectedProperty && (
        <div className="modal" onClick={closeMapModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex">
              <div className="close" onClick={closeMapModal}>
                &times;
              </div>
              {selectedProperty.parcel_number}
            </div>
            <iframe
              width="600"
              height="450"
              src={`https://www.google.com/maps?q=${selectedProperty.latitude},${selectedProperty.longitude}&z=15&output=embed`}
              style={{ border: "0" }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};
