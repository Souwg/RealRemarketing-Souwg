import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import Paramour from "../../fonts/Paramour.ttf"; 

export const Navbar = () => {
  // Estilo en línea que aplica la fuente
  const titleStyle = {
    fontFamily: "paramour, sans-serif",
    fontSize: "7rem",
  };

  return (
    <nav className="navbar">
      <style>
        {`
          @font-face {
            font-family: 'paramour';
            src: url(${Paramour}) format('truetype');
          }
        `}
      </style>
      <Link className="navbar-brand title fw-bold" style={{ color: "inherit", }}to="/">
        <h1 style={titleStyle}>RealRemarketing</h1>
      </Link>
    </nav>
  );
};