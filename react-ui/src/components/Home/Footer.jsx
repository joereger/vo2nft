const Footer = () => (
  <footer className="footer bg-dark pt-5 pt-md-6 pt-lg-7">
    <div className="container pt-3 pt-md-0">
      <div className="pb-md-4 text-center">
        <h3 className="text-light fw-light mb-3">Still not convinced?</h3>
        <h2 className="text-light mb-5">Add premium support and lifetime updates to this.</h2>
        <a className="btn btn-primary" href="https://themes.getbootstrap.com/product/around-multipurpose-template-ui-kit/" target="_blank" rel="noreferrer"><i className="ai-shopping-cart fs-lg me-2"></i>Buy Around</a>
      </div>
      <hr className="hr-light my-5" />
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-7 pb-md-4 text-center">
          <h4 className="text-light mb-grid-gutter">Subscribe to Newsletter</h4>
          <form className="subscription-form validate" action="https://studio.us12.list-manage.com/subscribe/post?u=c7103e2c981361a6639545bd5&amp;amp;id=29ca296126" method="post" name="mc-embedded-subscribe-form" target="_blank" novalidate>
            <div className="input-group flex-nowrap"><i className="ai-mail position-absolute top-50 start-0 translate-middle-y text-muted ms-3"></i>
              <input className="form-control rounded-start" type="email" name="EMAIL" placeholder="Your email" />
              <button className="btn btn-primary" type="submit" name="subscribe">Subscribe*</button>
            </div>
            <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
              <input className="subscription-form-antispam" type="text" name="b_c7103e2c981361a6639545bd5_29ca296126" tabIndex="-1" />
            </div>
            <div className="form-text text-light opacity-50">*Subscribe to our newsletter to receive early discount offers and new templates info.</div>
            <div className="subscription-status"></div>
          </form>
        </div>
      </div>
      <hr className="hr-light my-5" />
      <p className="fs-sm text-center mb-0 pb-5"><span className="text-light opacity-50 me-1">© All rights reserved. Made by</span>
      <a className="nav-link-style nav-link-light" href="https://createx.studio/" target="_blank" rel="noreferrer">Createx Studio</a></p>
    </div>
  </footer>
);

export default Footer
