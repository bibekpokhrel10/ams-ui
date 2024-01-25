import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { HomePage } from "./pages/home_page.js";
import { LoginPage } from "./pages/login_page.js";
import { RegisterPage } from "./pages/register_page.js";
import { DashBoard } from "./pages/dashboard.js";

export default function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/register">
            <RegisterPage />
          </Route>
          <Route exact path="/dashboard">
            <DashBoard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}