import React, { useContext } from "react"
import { NavLink } from 'react-router-dom';
import main from '../img/avatar.png';
import { UserContext } from "./UserContext"

const NavbarUserDropdown = () => {

  const [userContext, setUserContext] = useContext(UserContext)

  return(
    <> 
    {(userContext && userContext.token)
        ?
          <div className="d-flex align-items-center order-lg-3 ms-lg-auto">
            <div className="navbar-tool dropdown">
              <NavLink className="navbar-tool-icon-box" to="/account">
                {(userContext.user && userContext.user.profile_pic) 
                  ? <img className="navbar-tool-icon-box-img" src={userContext.user.profile_pic} alt="" />
                  : <img className="navbar-tool-icon-box-img" src={main} alt="" />
                }
              </NavLink>
              <NavLink className="navbar-tool-label dropdown-toggle" to="/account"><small>Hello,</small>{userContext.user && userContext.user.name}</NavLink>
              <ul className="dropdown-menu dropdown-menu-end" style={{width: '15rem'}}>
                <li>
                  <NavLink className="dropdown-item d-flex align-items-center" to="/account">
                    <i className="ai-users fs-base opacity-60 me-2"></i>
                    Account & Settings
                  </NavLink>
                  {(userContext.user && userContext.user.username) 
                    ? <NavLink className="dropdown-item d-flex align-items-center" to={'/u/'+userContext.user.username}>
                        <i className="ai-users fs-base opacity-60 me-2"></i>
                        Profile & Workouts
                      </NavLink>
                    : ""
                  }
                </li>
                
                <li className="dropdown-divider"></li>
                <li>
                  <NavLink className="dropdown-item d-flex align-items-center" to="/Logout">
                    <i className="ai-log-out fs-base opacity-60 me-2"></i>Log out
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        : null
      }

      </> 
  );

}

export default NavbarUserDropdown
