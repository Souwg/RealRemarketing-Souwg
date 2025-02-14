import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import "../../styles/sidebar.css"; // Importa los estilos del Sidebar
import Paramour from "../../fonts/Paramour.ttf";
import Sidebar from "./sidebar"; // Importa el componente Sidebar

export const Navbar = () => {
  // Estilo en línea que aplica la fuente
  const titleStyle = {
    fontFamily: "paramour, sans-serif",
    fontSize: "7rem",
  };

  return (
    <>
      <div className="row">
        <div className="col-1">
          <Sidebar />
        </div>
        <div className="col-11">
          <nav className="navbar">
            <style>
              {`
            @font-face {
              font-family: 'paramour';
              src: url(${Paramour}) format('truetype');
            }
          `}
            </style>
            <Link
              className="navbar-brand title fw-bold"
              style={{ color: "inherit" }}
              to="/"
            >
              <h1 style={titleStyle}>RealRemarketing</h1>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};
