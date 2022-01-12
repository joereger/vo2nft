import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { UserContext } from "./components/UserContext"

function RequireAuth({ children }) {
    //const { authed } = useAuth();
    const [userContext, setUserContext] = useContext(UserContext)
    var authed = false;
    const location = useLocation();

    if (userContext.token){
        authed = true;
    }
  
    return authed === true
      ? children
      : <Navigate
          to="/signin"
          replace
          state={{ path: location.pathname }}
        />;
  }

  export default RequireAuth;