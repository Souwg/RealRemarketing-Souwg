import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        {/* Brand logo */}
        <Link className="navbar-brand title fw-bold" to="/">
          <h2>RealRemarketing</h2>
        </Link>

        {/* Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-grid-fill text-primary fs-3"></i>
        </button>

        {/* Collapsible Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-dark" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-dark" to="/excel">
                Excel
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle fw-semibold text-dark d-flex align-items-center"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-three-dots-vertical me-2"></i>Menu
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg rounded-3 border-0">
                <li>
                  <Link
                    className="dropdown-item text-dark d-flex align-items-center"
                    to="/register"
                  >
                    <i className="bi bi-person-plus me-2"></i>Register
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item text-dark d-flex align-items-center"
                    to="/login"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>Login
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
