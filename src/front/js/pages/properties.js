import React, { useState, useEffect } from 'react';

export const ShowProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('https://studious-palm-tree-7v4xxv5wq5x2pj99-3001.app.github.dev/api/properties');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProperties(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching the properties.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="parcel-table-container">
      <h3 style={{ fontWeight: '600', }}>Properties List</h3>
      {properties.length > 0 ? (
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
            {properties.map((property) => (
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
                <td style={{ whiteSpace: 'pre-wrap' }}>{property.fema_flood_zone}</td>
                <td>
                  <a
                    href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Map
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign:'center', fontWeight:'600', }}>No properties found in the database.</p>
      )}
    </div>
  );
};
