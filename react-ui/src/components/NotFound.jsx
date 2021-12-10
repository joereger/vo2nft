import notFount from '../img/pages/404/404-illustration.svg';
import Navbar from './Navbar';

const NotFound = () => (
  <>
    <Navbar bg="light"/>
    <div className="container d-flex flex-column justify-content-center pt-5 mt-4" style={{flex: '1 0 auto'}}>
      <div className="pt-7 pb-5">
        <div className="text-center mb-2 pb-4">
          <h1 className="mb-grid-gutter">
            <img className="d-inline-block" src={notFount} alt="Error 404" />
            <span className="visually-hidden">Error 404</span>
            <span className="d-block pt-3 fs-sm fw-semibold text-danger">Error code: 404</span>
          </h1>
          <h2>Page not found!</h2>
          <p className="pb-2">
            It seems we can’t find the page you are looking for.
          </p>
          <a className="btn btn-translucent-primary me-3" href="/">Go to homepage</a>
          <span>Or try</span>
        </div>
        <div className="input-group mx-auto" style={{maxWidth: '390px'}}>
          <i className="ai-search position-absolute top-50 start-0 translate-middle-y ms-3"></i>
          <input className="form-control rounded" type="text" placeholder="Search" required />
        </div>
      </div>
    </div>
    <footer className="footer py-4">
      <div className="container d-md-flex align-items-center justify-content-between py-2 text-center text-md-end">
        <ul className="list-inline fs-sm mb-3 mb-md-0 order-md-2">
          <li className="list-inline-item my-1">
            <a className="nav-link-style" href="/" >Support</a>
          </li>
          <li className="list-inline-item my-1">
            <a className="nav-link-style" href="/">Contacts</a>
          </li>
          <li className="list-inline-item my-1">
            <a className="nav-link-style" href="/">Terms &amp; Conditions</a>
          </li>
        </ul>
        <p className="fs-sm mb-0 me-3 order-md-1">
          <span className="text-muted me-1">© All rights reserved. Made by</span>
          <a className="nav-link-style fw-normal" href="/" target="_blank" rel="noreferrer">Createx Studio</a>
        </p>
      </div>
    </footer>
  </>
);

export default NotFound;
