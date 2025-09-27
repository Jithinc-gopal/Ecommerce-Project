// src/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children ,adminOnly  = false}) => {
  const isLoged = localStorage.getItem("isLoged") === "true"
  const role = localStorage.getItem("role")
  const location  = useLocation()

  if (!isLoged) {
    return <Navigate to="/Login" replace  />;
  }
  if(role === "admin" && !location.pathname.startsWith("/Admin")){
    return <Navigate to="/Admin" replace/>
  }
  if(adminOnly && role !== "admin"){
    return <Navigate to="/Home" replace/>
  }

  return children;
};

export default ProtectedRoute;
