import React from 'react';
import {Route, Navigate} from 'react-router-dom';

const PrivateRoute = ({ component: Component, permittedRoles, ...rest }) => {
  const currentRole = getCurrentUserRole(); // Replace with actual role retrieval logic

  return (
  <Route
      {...rest}
      element={permittedRoles.includes(currentRole) ? <Component /> : <Navigate to="/login" />}
  />
  );
};

const getCurrentUserRole = () => {
  // Replace this with actual authentication role retrieval logic
  // For example, you might get the role from a user context, a Redux store, or directly from localStorage
  return localStorage.getItem('userRole'); // Example using localStorage
};

export default PrivateRoute;