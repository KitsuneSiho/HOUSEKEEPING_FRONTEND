import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const isAuthenticated = () => {
  const token = localStorage.getItem('access');
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('access');
      return false;
    }
    return true;
  } catch (error) {
    localStorage.removeItem('access');
    return false;
  }
};

const RouteAuthProvider = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default RouteAuthProvider;
