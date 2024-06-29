import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, permittedRoles }) => {
  const { data: { user } } = useSelector(state => state.auth);
  const [userRoles, setUserRoles] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (user && user.roles) {
      setUserRoles([user.roles]);
      console.log('User Roles:', userRoles);
    }
  }, []);

  useEffect(() => {
    if (userRoles.length > 0) {
      setHasAccess(userRoles.some(role => permittedRoles.includes(role)));
    }
  }, [userRoles, permittedRoles]);

  console.log('User:', user);
  console.log('Permitted Roles:', permittedRoles);
  console.log('Has Access:', hasAccess);

  return userRoles.length > 0 && hasAccess ? (
      <Component />
  ) : (
      <Navigate to="/404" />
  );
};

export default PrivateRoute;
