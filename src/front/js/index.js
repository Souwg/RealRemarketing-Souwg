// index.js
import React from "react";
import ReactDOM from "react-dom";
import Layout from "./layout"; // tu componente principal

const rootElement = document.querySelector("#app");

const render = (Component) => {
  ReactDOM.render(<Component />, rootElement);
};

render(Layout);

// HMR setup
if (module.hot) {
  module.hot.accept("./layout", () => {
    const NextLayout = require("./layout").default;
    render(NextLayout);
  });
}
