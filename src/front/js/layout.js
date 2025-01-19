import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { DemoTwo } from "./pages/demo2";
import { DemoThree } from "./pages/demo3";
import { Register } from "./pages/register";
import { Login } from "./pages/login";
import { User } from "./pages/user";
import { DemoOne} from "./pages/demo1";

import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Sidebar from "./component/sidebar";

const Layout = () => {
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "")
    return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
        <Sidebar/>
        <div className="layout-content">
          <Navbar /> 
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<DemoTwo />} path="/demo2" />
            <Route element={<DemoThree />} path="/demo3" />
            <Route element={<Login />} path="/login" />
            <Route element={<Register />} path="/register" />
            <Route element={<User />} path="/user" />
            <Route element={<DemoOne />} path="/demo1" />
            <Route element={<h1>Not found!</h1>} />
          </Routes>
          <Footer />
          </div>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
