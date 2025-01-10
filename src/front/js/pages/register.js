import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/register.css";
import Swal from "sweetalert2";

export const Register = () => {
  //register
  const { actions, store } = useContext(Context);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
  });

  //terms and conditions
  const [showModal, setShowModal] = useState(false);
  const [checkTerms, setCheckTerms] = useState(false);
  const [error, setError] = useState("");

  //terms and conditions(logic)
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setCheckTerms(isChecked);
    if (isChecked) {
      setShowModal(false);
    } else {
      setError("You must accept the terms and conditions.");
      Swal.fire(error);
    }
  };

  //register(logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkTerms) {
      const response = await actions.signupUser(
        userData.name,
        userData.last_name,
        userData.email,
        userData.password
      );
      if (!response.error) {
        Swal.fire({
          title: "You are now registered",
          icon: "success",
          draggable: true,
        });
        navigate("/login");
      } else {
        Swal.fire({
            title: "Registration Error",
            text: response.msg, 
            icon: "error",
            draggable: true,
        });
    }
} else {
    Swal.fire("You must accept the terms and conditions.");
}
};

  return (
    <>
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="register-title">Register</h2>
          


          {/* Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              placeholder="Enter your name"
            />
          </div>

          {/* Last name */}
          <div className="form-group">
            <label htmlFor="last_name" className="form-label">
              Last name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-control"
              placeholder="Enter your last name"
              value={userData.last_name}
              onChange={(e) =>
                setUserData({ ...userData, last_name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              placeholder="Create a password"
            />
          </div>

          {/*Terms and Conditions*/}
          {/*From Uiverse.io by bociKond */}

          <label className="container d-flex gap-2 p-0">
            <input
              type="checkbox"
              id="termsCheck"
              checked={checkTerms}
              onChange={handleCheckboxChange}
            />
            <div className="checkmark"></div>

            <label
              className="mb-2"
              htmlFor="termsCheck"
              style={{ fontSize: "14px" }}
            >
              Accepted{" "}
              <a
                href="#"
                onClick={toggleModal}
                style={{ fontSize: "14px", paddingTop: "3px" }}
              >
                Terms and Conditions
              </a>
            </label>
          </label>

          {/* Register */}
          <button type="submit" className="btn-register">
            Register
          </button>
        </form>

        {/*Terms and Condition's modal*/}
        {showModal && (
          <>
            <div className={`modal-backdrop fade ${showModal ? "show" : ""}`} />
            <div
              className="modal show"
              style={{ display: "block" }}
              tabIndex="-1"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title ms-2">Terms and Conditions</h5>
                    <button
                      type="button"
                      className="btn-close mb-1 me-2"
                      onClick={toggleModal}
                      aria-label="Close"
                      style={{
                        fontFamily: "cursive",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>...</p>
                  </div>
                  <div className="modal-footer">
                    <div className="form-check d-flex">
                      <input
                        type="checkbox"
                        id="termsCheck"
                        checked={checkTerms}
                        onChange={handleCheckboxChange}
                        className="form-check-input me-2"
                      />
                      <label
                        className="form-check-label"
                        style={{ marginTop: "0.2em" }}
                        htmlFor="termsCheck"
                      >
                        Accepted Terms and Conditions
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
