import React, {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import BackgroundContent from "./BackgrountContent";

const PrivateRoute = ({component: Component, permittedRoles, isBackground}) => {
    const {data: {user}} = useSelector(state => state.auth);
    const [userRoles, setUserRoles] = useState([]);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        if (user && user.roles) {
            const roles = user.roles.map(role => role.name)
            setUserRoles(roles);
        }
    }, [user]);

    console.log(userRoles , 'userRoles')
    console.log(hasAccess , 'hasAccess')

    useEffect(() => {
        if (userRoles.length > 0) {
            setHasAccess(userRoles.some(role => permittedRoles.includes(role)));
        }
    }, [userRoles, permittedRoles]);


    return userRoles.length > 0 && hasAccess ? (
        isBackground ?
            <BackgroundContent>
                <Component/>
            </BackgroundContent>
            :
            <Component/>

    ) : (
        <div>404 </div>
    );
};

export default PrivateRoute;
