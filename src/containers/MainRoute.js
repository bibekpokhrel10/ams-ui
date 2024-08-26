import React from "react";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { LoginPage } from "../pages/login_page";
import { Dashboard } from "../pages/dashboard";
import { PrimarySearchAppBar } from "../components/appbar/appbar";
import { RegisterPage } from "../pages/register_page";

function Routing() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/register" element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Routing;
