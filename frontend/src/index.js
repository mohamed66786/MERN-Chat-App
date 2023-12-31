import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { disapleReactDevTools } from "@fvilers/disable-react-devtools";

disapleReactDevTools();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
