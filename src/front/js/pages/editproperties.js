import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const EditProperties = () => {
  const [properties, setProperties] = useState([]); // Lista de propiedades
  const [selectedProperty, setSelectedProperty] = useState(null); // Propiedad seleccionada
  const [editedFields, setEditedFields] = useState({}); // Campos editados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newField, setNewField] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  // Agregar campos nuevos
  const handleAddField = () => {
    if (!newField.trim()) return;
    setSelectedProperty((prevProperty) => ({
      ...prevProperty,
      additional_data: {
        ...(prevProperty.additional_data || {}),
        [newField]: newFieldValue,
      },
    }));
    setEditedFields((prevFields) => ({
      ...prevFields,
      [newField]: newFieldValue,
    }));
    console.log("Nuevo campo agregado:", newField, newFieldValue);
    setNewField("");
    setNewFieldValue("");
  };

  //Elimina cada una de las propiedades
  const handleDeleteField = async (field) => {
    if (!selectedProperty) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/delete/property-field/${selectedProperty.parcel_number}/${field}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete field");

      alert(`Field '${field}' deleted successfully!`);

      // 🔥 Actualizar el estado localmente para reflejar el cambio en la UI
      setSelectedProperty((prevProperty) => {
        const updatedData = { ...prevProperty };

        if (
          updatedData.additional_data &&
          field in updatedData.additional_data
        ) {
          delete updatedData.additional_data[field]; // 🔥 Eliminar de additional_data si está ahí
        } else {
          delete updatedData[field]; // 🔥 Eliminar del objeto general si es un campo principal
        }

        return updatedData;
      });
    } catch (err) {
      console.error(err);
      alert("Error deleting the field: " + err.message);
    }
  };

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

    // Combinar los campos de la propiedad con additional_data
    const fullProperty = {
      ...property,
      ...property.additional_data, // 🔥 Agregar los campos personalizados
    };

    setSelectedProperty(fullProperty);
    setEditedFields(fullProperty); // También inicializar los valores editables
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
          body: JSON.stringify({
            additional_data: selectedProperty.additional_data,
          }),
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
      setEditedFields((prev) => ({ ...prev }));
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
            {/* Renderizar campos principales de la propiedad */}
            {Object.entries(selectedProperty).map(([field, value]) =>
              field !== "additional_data" ? (
                <div className="form-group" key={field}>
                  <label>{field.replace(/_/g, " ").toUpperCase()}</label>
                  <input
                    type="text"
                    value={editedFields[field] ?? value ?? ""}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                  />
                  <button
                    onClick={() => handleDeleteField(field)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ) : null
            )}

            {/* Renderizar los campos adicionales de additional_data dinámicamente */}
            {selectedProperty.additional_data &&
              Object.entries(selectedProperty.additional_data).map(
                ([field, value]) => (
                  <div className="form-group" key={field}>
                    <label>{field.replace(/_/g, " ").toUpperCase()}</label>
                    <input
                      type="text"
                      value={editedFields[field] ?? value ?? ""}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                    />
                    <button
                      onClick={() => handleDeleteField(field)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                )
              )}
          </form>

          {/* Inputs para agregar nuevos campos dinámicos */}
          <div className="add-new-field">
            <input
              type="text"
              placeholder="New field name"
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
            />
            <button onClick={handleAddField}>Add Field</button>
          </div>

          <button onClick={saveChanges} className="save-btn">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
