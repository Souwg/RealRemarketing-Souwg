import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const EditProperties = () => {
  const [properties, setProperties] = useState([]); // Lista de propiedades
  const [selectedProperty, setSelectedProperty] = useState(null); // Propiedad seleccionada
  const [editedFields, setEditedFields] = useState({}); // Campos editados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener las propiedades al cargar el componente
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/properties");
        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = await response.json();
        setProperties(data);
        setError(null);
      } catch (err) {
        setError(err.message || "An error occurred while fetching properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Manejar la selección de la propiedad
  const handleSelectProperty = (event) => {
    const parcelNumber = event.target.value;
    const property = properties.find(
      (property) => property.parcel_number === parcelNumber
    );
    setSelectedProperty(property);
    setEditedFields({}); // Resetear los campos editados
  };

  // Manejar los cambios en los campos del formulario
  const handleFieldChange = (field, value) => {
    setEditedFields({
      ...editedFields,
      [field]: value,
    });
  };

  // Enviar los cambios al backend
  const saveChanges = async () => {
    if (!selectedProperty) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/update/property/${selectedProperty.parcel_number}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedFields),
        }
      );

      if (!response.ok) throw new Error("Failed to update property");
      const data = await response.json();
      alert("Property updated successfully!");
      console.log("Updated property:", data);

      // Actualizar la lista de propiedades localmente (opcional)
      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property.parcel_number === selectedProperty.parcel_number
            ? { ...property, ...editedFields }
            : property
        )
      );
      setEditedFields({});
    } catch (err) {
      console.error(err);
      alert("Error updating the property: " + err.message);
    }
  };

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="edit-properties-container">
      <h3>Edit Properties</h3>

      {/* Dropdown para seleccionar la propiedad */}
      <div className="property-selector">
        <label htmlFor="property-select">Select Property:</label>
        <select
          id="property-select"
          onChange={handleSelectProperty}
          value={selectedProperty?.parcel_number || ""}
        >
          <option value="" disabled>
            -- Select a Property --
          </option>
          {properties.map((property) => (
            <option key={property.parcel_number} value={property.parcel_number}>
              {property.parcel_number} - {property.address}
            </option>
          ))}
        </select>
      </div>

      {/* Formulario dinámico para editar la propiedad seleccionada */}
      {selectedProperty && (
        <div className="edit-form">
          <h4>Editing Property: {selectedProperty.parcel_number}</h4>
          <form>
            {Object.keys(selectedProperty).map((field) => (
              <div className="form-group" key={field}>
                <label>{field.replace(/_/g, " ").toUpperCase()}</label>
                <input
                  type="text"
                  defaultValue={selectedProperty[field]}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                />
              </div>
            ))}
          </form>
          <button onClick={saveChanges} className="save-btn">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
