import React, { useState, useEffect } from "react";
import "../../styles/properties.css";

export const ShowProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el número de parcela
  const [filteredProperties, setFilteredProperties] = useState([]); // Estado para las propiedades filtradas
  const [selectedProperty, setSelectedProperty] = useState(null); // Estado para la propiedad seleccionada
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir y cerrar el modal

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
        setFilteredProperties(data); // Inicialmente, todas las propiedades están visibles
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

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === "") {
      setFilteredProperties(properties); // Muestra todas las propiedades si no hay búsqueda
    } else {
      const filtered = properties.filter((property) =>
        property.parcel_number.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  };

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
      <div>
        <section className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
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
          placeholder={isFocused ? "" : "Search parcel"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
              <th>Zoning</th>
              <th>Year Built</th>
              <th>Improvement Value</th>
              <th>Land Value</th>
              <th>Parcel Value</th>
              <th>Mail Address</th>
              <th>Mail City</th>
              <th>Mail State</th>
              <th>Mail Zip</th>
              <th>Mail Country</th>
              <th>Address</th>
              <th>Zip Code</th>
              <th>Building SQFT</th>
              <th>Building Count</th>
              <th>Legal Description</th>
              <th>County</th>
              <th>State</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Acre</th>
              <th>Acre SQFT</th>
              <th>FEMA Flood Zone</th>
              <th>Map</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property) => (
              <tr key={property.parcel_number}>
                <td>{property.parcel_number}</td>
                <td>{property.owner}</td>
                <td>{property.zoning}</td>
                <td>{property.year_built}</td>
                <td>{property.improvement_value}</td>
                <td>{property.land_value}</td>
                <td>{property.parcel_value}</td>
                <td>{property.mail_address}</td>
                <td>{property.mail_city}</td>
                <td>{property.mail_state}</td>
                <td>{property.mail_zip}</td>
                <td>{property.mail_country}</td>
                <td>{property.address}</td>
                <td>{property.zip_code}</td>
                <td>{property.building_SQFT}</td>
                <td>{property.building_count}</td>
                <td>{property.legal_description}</td>
                <td>{property.county}</td>
                <td>{property.state}</td>
                <td>{property.latitude}</td>
                <td>{property.longitude}</td>
                <td>{property.acre}</td>
                <td>{property.acre_sqft}</td>
                <td style={{ whiteSpace: "pre-wrap" }}>
                  {property.fema_flood_zone}
                </td>
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
