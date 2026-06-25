import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from "js-cookie";
const ProtectedRoute = ({ children }) => {
  // 👇 YAHAN BADLAAV KIYA HAI ('token' ki jagah 'access_token' likha hai) 👇
  const token = Cookies.get('access_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;