import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/sidebar.css";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMouseEnterIcon = () => {
    setIsSidebarOpen(true); 
  };

  const handleMouseLeaveSidebar = () => {
    setIsSidebarOpen(false); 
  };

  return (
    <div>
      <div
        className="nav-open-icon"
        onMouseEnter={handleMouseEnterIcon}
      >
        <ion-icon name="reorder-three-outline"></ion-icon>
      </div>

      {/* Sidebar */}
      <nav
        className={`nav ${isSidebarOpen ? "js-opened" : ""}`}
        onMouseLeave={handleMouseLeaveSidebar} 
      >
        <ul className="nav__list">
          <li className="nav__item">
            <Link
              to="/"
              className="nav__link"
            >
              <span className="nav_link-text" ><ion-icon name="home-outline"></ion-icon></span>
            </Link>
          </li>
          <li className="nav_item">
            <Link to="/login" className="nav_link">
              <span className="nav_link-text"><ion-icon name="person-outline"></ion-icon></span>
            </Link>
          </li>
          <li className="nav_item">
            <Link to="/demo1">
              <span className="nav_link-text"><ion-icon name="bug-outline"></ion-icon></span>
            </Link>
          </li>
          <li className="nav_item">
            <Link to="/demo2">
              <span className="nav_link-text"><ion-icon name="pizza-outline"></ion-icon></span>
            </Link>
          </li>
          <li className="nav_item">
            <Link to="/demo3">
              <span className="nav_link-text"><ion-icon name="extension-puzzle-outline"></ion-icon></span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
