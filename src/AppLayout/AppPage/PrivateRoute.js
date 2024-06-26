import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, permittedRoles }) => {
  const currentRole = getCurrentUserRole(); // Replace with actual role retrieval logic
  return permittedRoles.includes(currentRole) ? (
      <Component />
  ) : (
      <Navigate to="/" />
  );
};

const getCurrentUserRole = () => {
  // Replace this with actual authentication role retrieval logic
  // For example, you might get the role from a user context, a Redux store, or directly from localStorage
  return 'boss'; // Example using localStorage
};

export default PrivateRoute;