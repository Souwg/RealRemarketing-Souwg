import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/sidebar.css";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div
        className="nav-open-icon"
        onMouseEnter={() => setIsSidebarOpen(true)}
        style={{ transform: `translateY(${scrollY}px)` }}
      >
        <ion-icon name="reorder-three-outline"></ion-icon>
      </div>

      <nav
        className={`nav ${isSidebarOpen ? "js-opened" : ""}`}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <ul className="nav__list">
          {[
            { to: "/", icon: "home-outline"},
            { to: "/login", icon: "person-outline" },
            { to: "/demo1", icon: "bug-outline" },
            { to: "/demo2", icon: "pizza-outline" },
            { to: "/demo3", icon: "extension-puzzle-outline" },
          ].map((item, index) => (
            <li key={index} className="nav__item">
              <Link to={item.to} className="nav_link">
                <span className="nav_link-text">
                  <ion-icon name={item.icon}></ion-icon>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
