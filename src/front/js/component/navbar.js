import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import CutLetterFont from "../../styles/fonts/cutLetter.ttf"; 
export const Navbar = () => {
  // Estilo en línea que aplica la fuente
  const titleStyle = {
    fontFamily: "CutLetter, sans-serif",
  };

  return (
    <nav>
      <style>
        {`
          @font-face {
            font-family: 'CutLetter';
            src: url(${CutLetterFont}) format('truetype');
          }
        `}
      </style>
      <Link className="navbar-brand title fw-bold" to="/">
        <h2 style={titleStyle}>RealRemarketing</h2>
      </Link>
    </nav>
  );
};