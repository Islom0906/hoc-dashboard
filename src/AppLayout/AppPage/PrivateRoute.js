import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, permittedRoles }) => {
  const { data: { user } } = useSelector(state => state.auth);
  const [userRoles, setUserRoles] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (user && user.roles) {
      const roles = user.roles.map(item => item.name);
      setUserRoles([...roles]);
    }
  }, [user]);

  useEffect(() => {
    if (userRoles.length > 0) {
      setHasAccess(userRoles.some(role => permittedRoles.includes(role)));
    }
  }, [userRoles, permittedRoles]);

  console.log('user', user);
  console.log('userRoles', userRoles);
  console.log('permittedRoles', permittedRoles);

  return hasAccess ? (
      <Component />
  ) : (
      <Navigate to="/404" />
  );
};

export default PrivateRoute;
