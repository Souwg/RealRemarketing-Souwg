import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
//import { DemoOne} from "./pages/demo1";*/
import { DemoTwo } from "./pages/demo2";
import { DemoThree } from "./pages/demo3";
import { ShowProperties } from "./pages/properties";
import { EditProperties } from "./pages/editproperties";
import { ExcelToCSVConverter } from "./pages/convert";
import { Register } from "./pages/register";
//import { Login } from "./pages/login";
import { User } from "./pages/user";

import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

const Layout = () => {
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "")
    return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <div className="layout-content">
            <Navbar />
            <Routes>
              <Route element={<Home />} path="/" />
              {/*<Route element={<DemoOne />} path="/demo1" />*/}
              <Route element={<DemoTwo />} path="/demo2" />
              <Route element={<DemoThree />} path="/demo3" />
              <Route
                element={<ShowProperties />}
                path="/demo3/showproperties"
              />
              <Route element={<EditProperties />} path="/editproperties" />
              <Route element={<ExcelToCSVConverter />} path="/convertcsv" />
              {/*<Route element={<Login />} path="/login" />*/}
              <Route element={<Register />} path="/register" />
              <Route element={<User />} path="/user" />
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
