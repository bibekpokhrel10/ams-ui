import React from "react";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { LoginPage } from "../pages/login_page";
import { Dashboard } from "../pages/dashboard";

function Routing() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Routing;
