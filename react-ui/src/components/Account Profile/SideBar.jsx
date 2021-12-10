import main from '../../img/dashboard/avatar/main.jpg';

const SideBar = () => (
  <div className="col-lg-4 mb-4 mb-lg-0">
  <div className="bg-light rounded-3 shadow-lg">
    <div className="px-4 py-4 mb-1 text-center">
      <img className="d-block rounded-circle mx-auto my-2" src={main} alt="Amanda Wilson" width="110" />
      <h6 className="mb-0 pt-1">Amanda Wilson</h6>
      <span className="text-muted fs-sm">@amanda_w</span>
    </div>
    <div className="d-lg-none px-4 pb-4 text-center">
      <a className="btn btn-primary px-5 mb-2" href="#account-menu" data-bs-toggle="collapse">
        <i className="ai-menu me-2"></i>Account menu
      </a>
    </div>
    <div className="d-lg-block collapse pb-2" id="account-menu">
      <h3 className="d-block bg-secondary fs-sm fw-semibold text-muted mb-0 px-4 py-3">Dashboard</h3>
      <a className="d-flex align-items-center nav-link-style px-4 py-3" href="dashboard-orders.html">
        <i className="ai-shopping-bag fs-lg opacity-60 me-2"></i>Orders
        <span className="nav-indicator"></span>
        <span className="text-muted fs-sm fw-normal ms-auto">2</span>
      </a>
      <a className="d-flex align-items-center nav-link-style px-4 py-3 border-top" href="dashboard-sales.html">
        <i className="ai-dollar-sign fs-lg opacity-60 me-2"></i>Sales<span className="text-muted fs-sm fw-normal ms-auto">$735.00</span></a><a className="d-flex align-items-center nav-link-style px-4 py-3 border-top" href="dashboard-messages.html"><i className="ai-message-square fs-lg opacity-60 me-2"></i>Messages<span className="nav-indicator"></span><span className="text-muted fs-sm fw-normal ms-auto">1</span></a><a className="d-flex align-items-center nav-link-style px-4 py-3 border-top" href="dashboard-followers.html"><i className="ai-users fs-lg opacity-60 me-2"></i>Followers<span className="text-muted fs-sm fw-normal ms-auto">34</span></a><a className="d-flex align-items-center nav-link-style px-4 py-3 border-top" href="dashboard-reviews.html"><i className="ai-star fs-lg opacity-60 me-2"></i>Reviews<span className="text-muted fs-sm fw-normal ms-auto">15</span></a><a className="d-flex align-items-center nav-link-style px-4 py-3 border-top" href="dashboard-favorites.html"><i className="ai-heart fs-lg opacity-60 me-2"></i>Favorites<span className="text-muted fs-sm fw-normal ms-auto">6</span></a>
      <h3 className="d-block bg-secondary fs-sm fw-semibold text-muted mb-0 px-4 py-3">Account settings</h3><a className="d-flex align-items-center nav-link-style px-4 py-3 active" href="account-profile.html">Profile info</a><a className="d-flex align-items-center nav-link-style px-4 py-3 border-top" href="account-payment.html">Payment methods</a>
      <div className="d-flex align-items-center border-top"><a className="d-block w-100 nav-link-style px-4 py-3" href="account-notifications.html">Notifications</a>
        <div className="ms-auto px-3">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="notifications-switch" data-master-checkbox-for="#notification-settings" defaultChecked />
            <label className="form-check-label" for="notifications-switch"></label>
          </div>
        </div>
      </div>
      <a className="d-flex align-items-center nav-link-style px-4 py-3 border-top" href="signin-illustration.html">
        <i className="ai-log-out fs-lg opacity-60 me-2"></i>Sign out
      </a>
    </div>
  </div>
</div>
);

export default SideBar
