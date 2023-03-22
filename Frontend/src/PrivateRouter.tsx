import React, { useContext } from 'react';

import { RouteProps, Navigate, useNavigate } from 'react-router-dom';
import { Context } from './store/Store';

interface PrivateRouteProps extends RouteProps {
    component: React.FC;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
    const [state, dispatch] = useContext(Context);
    const navigate = useNavigate();
    // validate login status:
    const isLoggedIn = !!state.user;
    const canEnterApp = state.user;



    return (
        <>
            {!isLoggedIn && <Navigate to="/login" />}
            {!state.error && isLoggedIn && <Component />}
        </>
    );
};

export default PrivateRoute;


