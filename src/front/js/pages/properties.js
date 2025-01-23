import React, { useState, useEffect } from "react";
import "../../styles/properties.css";

export const ShowProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el número de parcela
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir y cerrar el modal
  const [selectedProperty, setSelectedProperty] = useState(null); // Estado para la propiedad seleccionada

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "https://studious-palm-tree-7v4xxv5wq5x2pj99-3001.app.github.dev/api/properties"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProperties(data);
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

  // Función para manejar la búsqueda dinámica
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtrar propiedades según la búsqueda
  const filteredProperties = properties.filter(
    (property) =>
      property.parcel_number
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Función para abrir el modal con el mapa
  const openMapModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeMapModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

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

  return (
    <div className="parcel-table-container">
      <h3 style={{ fontWeight: "600" }}>Properties List</h3>

      {/* Input para buscar por número de parcela */}
      <div className="search-container">
        <input
          type="text"
          className="input-parcel"
          placeholder="Search by parcel number or address"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {filteredProperties.length > 0 ? (
        <table className="parcel-table">
          <thead>
            <tr>
              <th>Parcel Number</th>
              <th>Owner</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Map</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property) => (
              <tr key={property.parcel_number}>
                <td>{property.parcel_number}</td>
                <td>{property.owner}</td>
                <td>{property.address}</td>
                <td>{property.mail_city}</td>
                <td>{property.mail_state}</td>
                <td>{property.mail_zip}</td>
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
          No properties found matching the search.
        </p>
      )}

      {/* Modal con el mapa de Google Maps */}
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
