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
    const canEnterApp = state.user; // TODO: check if user is valid(has unit, phone...etc) to enter app
    // else he can login to the page, show the component
    console.log('PrivateRouter - isLoggedIn:', isLoggedIn);
    console.log('user:', state.user);
    console.log('error:', Boolean(state.error));

    // console.log('state error', state.error);

    // if (state.error || !isLoggedIn) {
    //     navigate('/login');
    // }

    return (
        <>
            {/* {state.error && <Navigate to="/error/" />} */}
            {!isLoggedIn && <Navigate to="/login" />}
            {!state.error && isLoggedIn && <Component />}
        </>
    );
};

export default PrivateRoute;

// return (
//     <>
//         {(state.error || !isLoggedIn) && <Navigate to="/login" />}
//         {/* {(state.error || !isLoggedIn) && <Navigate to="/login" />} */}
//         {/* the under route is stands for user under some circumstances  */}
//         {/* {!canEnterApp && <Navigate to="/login" />} */}

//         <Component />
//     </>
// );
