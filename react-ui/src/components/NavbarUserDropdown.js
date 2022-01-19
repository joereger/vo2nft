import React, { useContext } from "react"
import { NavLink } from 'react-router-dom';
import main from '../img/dashboard/avatar/main.jpg';
import { UserContext } from "./UserContext"

const NavbarUserDropdown = () => {

  const [userContext, setUserContext] = useContext(UserContext)

  return(
    <> 
    {userContext.token 
        ?
          <div className="d-flex align-items-center order-lg-3 ms-lg-auto">
            <div className="navbar-tool dropdown">
              <NavLink className="navbar-tool-icon-box" to="/account-profile">
                <img className="navbar-tool-icon-box-img" src={main} alt="" />
              </NavLink>
              <NavLink className="navbar-tool-label dropdown-toggle" to="/account-profile"><small>Hello,</small>{userContext.user && userContext.user.name}</NavLink>
              <ul className="dropdown-menu dropdown-menu-end" style={{width: '15rem'}}>
                <li>
                  <NavLink className="dropdown-item d-flex align-items-center" to="/account-profile">
                    <i className="ai-users fs-base opacity-60 me-2"></i>
                    Account Profile
                    {/* <span className="ms-auto fs-xs text-muted">2</span> */}
                  </NavLink>
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
