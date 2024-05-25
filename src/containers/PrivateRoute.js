import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute() {
  const authValue = useSelector((state) => {
    console.log("useSelector called with state:", state);
    return state.auth.isAuthenticated;
  });
  console.log("authentication :: ", authValue);
  return (
    <div>
      {authValue ? (
        <>
          <Outlet />
        </>
      ) : (
        <Navigate to="/" />
      )}
    </div>
  );
}

export default PrivateRoute;
