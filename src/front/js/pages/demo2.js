import React, { useState } from "react";
import "../../styles/demo2.css";
import dayrom from "../../fonts/DAYROM__.ttf";

export const DemoTwo = () => {
  const [parcelNumber, setParcelNumber] = useState("");
  const [parcelData, setParcelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const titleStyle = {
    fontFamily: "dayrom1",
    fontSize: "3rem",
    textAlign: "center",
    fontWeight: "400",
    marginBottom: "0",
  };

  const fieldNames = {
    ogc_fid: "OGC FID",
    geoid: "Geo ID",
    parcelnumb: "Parcel Number",
    parcelnumb_no_formatting: "Parcel Number (No Formatting)",
    usecode: "Use Code",
    usedesc: "Use Description",
    Zoning: "Zoning",
    zoning_description: "Zoning Description",
    yearbuilt: "Year Built",
    structstyle: "Structure Style",
    parvaltype: "Parcel Value Type",
    improvval: "Improvement Value",
    landval: "Land Value",
    parval: "Parcel Value",
    Owner: "Owner",
    mailadd: "Mailing Address",
    mail_city: "Mailing City",
    mail_state2: "Mailing State",
    mail_zip: "Mailing ZIP Code",
    mail_country: "Mailing Country",
    Address: "Address",
    zoning_type: "Zoning Type",
    zoning_subtype: "Zoning Subtype",
    zoning_code_link: "Zoning Code Link",
    ll_address_count: "Land Lot Address Count",
    fema_flood_zone: "FEMA Flood Zone",
    fema_flood_zone_subtype: "FEMA Flood Zone Subtype",
    fema_flood_zone_raw: "FEMA Flood Zone Raw Data",
    fema_flood_zone_data_date: "FEMA Flood Zone Data Date",
    census_unified_school_district: "Census Unified School District",
    ll_bldg_footprint_sqft: "Building Footprint (sqft)",
    ll_bldg_count: "Building Count",
    placekey: "Placekey",
    dpv_status: "DPV Status",
    dpv_codes: "DPV Codes",
    dpv_notes: "DPV Notes",
    dpv_type: "DPV Type",
    cass_errorno: "CASS Error Number",
    rdi: "RDI",
    usps_vacancy: "USPS Vacancy",
    usps_vacancy_date: "USPS Vacancy Date",
    lbcs_activity: "LBCS Activity",
    lbcs_activity_desc: "LBCS Activity Description",
    lbcs_function: "LBCS Function",
    lbcs_function_desc: "LBCS Function Description",
    lbcs_structure: "LBCS Structure",
    lbcs_structure_desc: "LBCS Structure Description",
    lbcs_site: "LBCS Site",
    lbcs_site_desc: "LBCS Site Description",
    zoning_id: "Zoning ID",
    saddno: "Street Address Number",
    saddstr: "Street Address",
    saddsttyp: "Street Address Type",
    scity: "City",
    original_address: "Original Address",
    City: "City",
    county: "County",
    state2: "State",
    szip: "ZIP Code",
    szip5: "ZIP Code (5 digits)",
    address_source: "Address Source",
    legaldesc: "Legal Description",
    subdivision: "Subdivision",
    lat: "Latitude",
    lon: "Longitude",
    qoz: "Qualified Opportunity Zone",
    census_tract: "Census Tract",
    census_block: "Census Block",
    census_blockgroup: "Census Block Group",
    census_zcta: "Census ZCTA",
    ll_last_refresh: "Last Refresh",
    ll_gisacre: "GIS Acreage",
    ll_gissqft: "GIS Square Footage",
    path: "Path",
    ll_stable_id: "Stable ID",
    ll_uuid: "UUID",
    ll_updated_at: "Last Updated At",
  };

  const handleInputChange = (event) => {
    setParcelNumber(event.target.value);
  };

  const fetchParcelData = async () => {
    setLoading(true);
    setError("");
    setParcelData(null);

    try {
      const response = await fetch(
        `https://app.regrid.com/api/v2/parcels/apn?parcelnumb=${parcelNumber}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM3Njg5MDUwLCJleHAiOjE3NDAyODEwNTAsInUiOjQ4NzI5MCwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.LCESilMr2HeYDj4ki5nNVSAQ5rqYobOkkTj5WS8ZQ_c`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch parcel data.");
      }

      const data = await response.json();
      if (data.parcels.features.length === 0) {
        throw new Error("No parcel found with the provided number.");
      }

      setParcelData(data.parcels.features[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parcel-info-container">
      <style>
        {`
          @font-face {
            font-family: 'dayrom1';
            src: url(${dayrom}) format('truetype');
          }

          .dark-title {
            color: #333; /* Color más oscuro para los títulos */
            font-weight: bold;
          }
        `}
      </style>
      <p style={titleStyle}>Parcels searching</p>
      <div className="container-search-parcel">
        <div className="search-container">
          <input
            className="input-parcel"
            type="text"
            value={parcelNumber}
            onChange={handleInputChange}
            placeholder={isFocused ? "" : "parcel Number"}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <svg
            viewBox="0 0 24 24"
            className="search__icon"
            onClick={fetchParcelData}
          >
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {parcelData && (
        <div className="parcel-table-container">
          <table className="parcel-table">
            <tbody>
              {Object.entries(parcelData.properties.fields).map(
                ([key, value]) => (
                  <tr key={key}>
                    <td className="dark-title">{fieldNames[key] || key}</td>{" "}
                    {/* Títulos con color más oscuro */}
                    <td>{value}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
