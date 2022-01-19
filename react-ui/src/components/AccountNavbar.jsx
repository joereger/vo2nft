import { NavLink } from 'react-router-dom';
import logoDark from '../img/logo/logo-dark.png';
import logoLight from '../img/logo/logo-light.png';
import logoIcon from '../img/logo/logo-icon.png';
import main from '../img/dashboard/avatar/main-sm.jpg';
import { useEffect, useContext } from 'react';
import { UserContext } from "./UserContext"
import NavbarUserDropdown from './NavbarUserDropdown';

const AccountNavbar = () => {
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
    <>
  <header className="header navbar navbar-expand-lg navbar-dark navbar-floating navbar-sticky" data-fixed-element>
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
        {/* <div className="offcanvas-header navbar-shadow">
          <h5 className="mt-1 mb-0">Menu</h5>
          <button className="btn-close lead" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div> */}
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            

            {!userContext.token 
              ? <li className="nav-item">
                <NavLink className="ps-3 nav-link" to="/login" activeclassname="active">Sign In</NavLink>
              </li>
              : null
            }

            {!userContext.token 
              ? <li className="nav-item">
                <NavLink className="ps-3 nav-link" to="/signup" activeclassname="active">Sign Up</NavLink>
              </li>
              : null
            }


              {/* <li className="nav-item">
                <NavLink className="ps-3 nav-link" to="/login" activeclassname="active">Sign In</NavLink>
              </li> */}
              {/* <li className="nav-item">
                <NavLink className="ps-3 nav-link" to="/signup" activeclassname="active">Sign Up</NavLink>
              </li> */}
        
          </ul>
        </div>
      </div>
      <NavbarUserDropdown />
    </div>
  </header>

  <div className="position-relative bg-gradient" style={{height: '480px'}}>
    <div className="shape shape-bottom shape-slant bg-secondary d-none d-lg-block">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 260">
        <polygon fill="currentColor" points="0,257 0,260 3000,260 3000,0"></polygon>
      </svg>
    </div>
  </div>
</>
)};

export default AccountNavbar;
