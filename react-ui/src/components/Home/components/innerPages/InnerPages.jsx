import { NavLink } from "react-router-dom";
import user from '../../../../img/demo/presentation/icons/user.svg';
import portfolio from '../../../../img/demo/presentation/icons/portfolio.svg';
import shoppingCart from '../../../../img/demo/presentation/icons/shopping-cart.svg';
import webPage from '../../../../img/demo/presentation/icons/web-page.svg';
import blog from '../../../../img/demo/presentation/icons/blog.svg';
import error404 from '../../../../img/demo/presentation/icons/error-404.svg';
import Card from './Card';
import { Tab, Row, Col, Nav } from 'react-bootstrap';

const InnerPages = () => (
  <section className="py-5 py-md-6 py-lg-7">
    <div className="container pb-3 pt-4 pb-lg-2">
      <div className="row justify-content-center mb-4 pb-2">
        <div className="col-xl-6 col-lg-7 col-md-8">
          <h2 className="h1 mb-4 text-center">
            Handcrafted <span className='bg-faded-primary rounded text-primary px-3 py-2'>Inner Pages</span>
          </h2>
          <p className="text-muted text-center">
            Big collection of thoroughly designed inner page templates from User Account/Dashboard to Specialty pages like 404 and Coming Soon
          </p>
        </div>
      </div>
      <Tab.Container defaultActiveKey="account" transition={true}>
        <Row>
          <Col lg={6}>
            <Nav className="nav-tabs media-tabs justify-content-center justify-content-lg-start">
              <Card tab="account" image={user} imageAlt="User Account" title="User Account &amp; Dashboard"/>
              <Card tab="portfolio" image={portfolio} imageAlt="Portfolio" title="Portfolio"/>
              <Card tab="ecommerce" image={shoppingCart} imageAlt="E-Commerce" title="E-Commerce"/>
              <Card tab="pages" image={webPage} imageAlt="Secondary Pages" title="Secondary Pages"/>
              <Card tab="blog" image={blog} imageAlt="Blog &amp; News" title="Blog &amp; News"/>
              <Card tab="specialty" image={error404} imageAlt="Specialty Pages" title="Specialty Pages"/>
            </Nav>
          </Col>
          <Col lg={6}>
            <Tab.Content>
              <Tab.Pane eventKey="account">
                <div className="row text-center text-sm-start">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <h3 className="h5 mb-4">User Account</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="account-profile.html">Profile Info</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="account-payment.html">Payment Methods</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="account-notifications.html">Notifications</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="signin-illustration.html">Sign In - Illustration</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="signin-image.html">Sign In - Image</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="signin-signup.html">Sign In - Sign Up</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="password-recovery.html">Password Recovery</NavLink>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-6">
                    <h3 className="h5 mb-4">Dashboard</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="dashboard-orders.html">Orders</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="dashboard-sales.html">Sales</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="dashboard-messages.html">Messages</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="dashboard-followers.html">Followers</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="dashboard-reviews.html">Reviews</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="dashboard-favorites.html">Favorites</NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="portfolio">
                <div className="row text-center text-sm-start">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <h3 className="h5 mb-4">Portfolio Grid</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="portfolio-style-1.html">Grid Style 1</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="portfolio-style-2.html">Grid Style 2</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="portfolio-style-3.html">Grid Style 3</NavLink>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-6">
                    <h3 className="h5 mb-4">Single Project</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="portfolio-single-side-gallery-grid.html">Project Side Gallery (Grid)</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="portfolio-single-side-gallery-list.html">Project Side Gallery (List)</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="portfolio-single-carousel.html">Project Carousel</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="portfolio-single-wide-gallery.html">Project Wide Gallery</NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="ecommerce">
                <div className="row text-center text-sm-start">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <h3 className="h5 mb-4">Shop Layouts</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="shop-ls.html">Grid Left Sidebar</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-noneGrid" to="shop-rs.html">Right Sidebar</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="shop-ns.html">Grid No Sidebar</NavLink>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-6">
                    <h3 className="h5 mb-4">Shop Pages</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="shop-single.html">Single Product</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="checkout.html">Cart &amp; Checkout</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="order-tracking.html">Order Tracking</NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="pages">
                <div className="row text-center text-sm-start">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <h3 className="h5 mb-4">Inner Pages</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="about.html">About</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-noneGrid" to="contacts-v1.html">Contacts v.1</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="contacts-v2.html">Contacts v.2</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="contacts-v3.html">Contacts v.3</NavLink>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-6">
                    <h3 className="h5 mb-4">Help Center</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="help-topics.html">Help Topics</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="help-single-topic.html">Single Topic</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="help-submit-request.html">Submit NavLink Request</NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="blog">
                <div className="row text-center text-sm-start">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <h3 className="h5 mb-4">Blog Layouts</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="blog-grid-rs.html">Grid Right Sidebar</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-noneGrid" to="blog-grid-ls.html">Grid Left Sidebar</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="blog-grid-ns.html">Grid No Sidebar</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="blog-list-rs.html">List Right Sidebar</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="blog-list-ls.html">List Left Sidebar</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="blog-list-ns.html">List No Sidebar</NavLink>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-6">
                    <h3 className="h5 mb-4">Single Post</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="blog-single-rs.html">Right Sidebar</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="blog-single-ls.html">Left Sidebar</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="blog-single-ns.html">No Sidebar</NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="specialty">
                <div className="row text-center text-sm-start">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <h3 className="h5 mb-4">404 Error</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="404-simple.html">Simple Text</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-noneGrid" to="404-illustration.html">Illustration</NavLink>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-6">
                    <h3 className="h5 mb-4">Coming Soon</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="coming-soon-image.html">Image</NavLink>
                      </li>
                      <li className="mb-3">
                        <NavLink className="fw-medium text-decoration-none" to="coming-soon-illustration.html">Illustration</NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  </section>
);

export default InnerPages;
