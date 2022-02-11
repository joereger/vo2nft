import { NavLink } from 'react-router-dom';
import logoDark from '../img/VO2NFT-logo-v01.png'
import logoLight from '../img/VO2NFT-logo-v01.png'
import logoIcon from '../img/logo/logo-icon.png';
//import main from '../img/dashboard/avatar/main-sm.jpg';
import main from '../img/avatar.png';
import { useEffect, useContext } from 'react';
import { UserContext } from "./UserContext"
import NavbarUserDropdown from './NavbarUserDropdown';

const Navbar = ({ bg }) => {
  const [userContext] = useContext(UserContext)

  useEffect(() => {
    let navbar = document.querySelector('.navbar-sticky');
    if (navbar == null) return;
    let navbarClass = navbar.classList;
    let navbarH = navbar.offsetHeight;
    let scrollOffset = 500;

    if (navbarClass.contains('navbar-floating') && navbarClass.contains('navbar-dark')) {
      window.addEventListener('scroll', function (e) {
        if (e.currentTarget.pageYOffset > scrollOffset) {
          navbar.classList.remove('navbar-dark');
          navbar.classList.add('navbar-light', 'navbar-stuck');
        } else {
          navbar.classList.remove('navbar-light', 'navbar-stuck');
          navbar.classList.add('navbar-dark');
        }
      });
    } else if (navbarClass.contains('navbar-floating') && navbarClass.contains('navbar-light')) {
      window.addEventListener('scroll', function (e) {
        if (e.currentTarget.pageYOffset > scrollOffset) {
          navbar.classList.add('navbar-stuck');
        } else {
          navbar.classList.remove('navbar-stuck');
        }
      });
    } else {
      window.addEventListener('scroll', function (e) {
        if (e.currentTarget.pageYOffset > scrollOffset) {
          document.body.style.paddingTop = navbarH + 'px';
          navbar.classList.add('navbar-stuck');
        } else {
          document.body.style.paddingTop = '';
          navbar.classList.remove('navbar-stuck');
        }
      });
    }
  });
  return (
  <header className={`header navbar navbar-expand-lg navbar-${bg} navbar-floating navbar-sticky`} data-fixed-element>
    <div className="container px-0 px-xl-3">
      <button className="navbar-toggler ms-n2 me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#primaryMenu">
        <span className="navbar-toggler-icon"></span>
      </button>
      <NavLink className="navbar-brand flex-shrink-0 order-lg-1 mx-auto ms-lg-0 pe-lg-2 me-lg-4" to="/">
        <img className="navbar-floating-logo d-none d-lg-block" src={logoLight} alt="Around" width="153" />
        <img className="navbar-stuck-logo" src={logoDark} alt="Around" width="153" />
        <img className="d-lg-none" src={logoIcon} alt="Around" width="58" />
      </NavLink>
      <div className="offcanvas offcanvas-collapse order-lg-2" id="primaryMenu">
        <div className="offcanvas-header navbar-shadow">
          <h5 className="mt-1 mb-0">Menu</h5>
          <button className="btn-close lead" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">


            {(!userContext || !userContext.token)
              ? <li className="nav-item">
                <NavLink className="ps-3 nav-link" to="/login" activeclassname="active">Log In</NavLink>
              </li>
              : null
            }

            {(!userContext || !userContext.token) 
              ? <li className="nav-item">
                <NavLink className="ps-3 nav-link" to="/signup" activeclassname="active">Sign Up</NavLink>
              </li>
              : null
            }

          </ul>
        </div>
      </div>


      <NavbarUserDropdown />
      {/* {userContext.token 
        ?
          <div className="d-flex align-items-center order-lg-3 ms-lg-auto">
            <div className="navbar-tool dropdown">
              <NavLink className="navbar-tool-icon-box" to="/account">
                <img className="navbar-tool-icon-box-img" src={main} alt="" />
              </NavLink>
              <NavLink className="navbar-tool-label dropdown-toggle" to="/account"><small>Hello,</small>{userContext.user && userContext.user.name}</NavLink>
              <ul className="dropdown-menu dropdown-menu-end" style={{width: '15rem'}}>
                <li>
                  <NavLink className="dropdown-item d-flex align-items-center" to="/account">
                    <i className="ai-users fs-base opacity-60 me-2"></i>
                    Account Profile
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
      } */}




    </div>
  </header>
)};

export default Navbar;
