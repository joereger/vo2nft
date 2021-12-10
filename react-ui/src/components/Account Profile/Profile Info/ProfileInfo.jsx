import main from '../../../img/dashboard/avatar/main.jpg';
import Form from './Form';

const ProfileInfo = () => (
  <div class="col-lg-8">
    <div class="d-flex flex-column h-100 bg-light rounded-3 shadow-lg p-4">
      <div class="py-2 p-md-3">
        <div class="d-sm-flex align-items-center justify-content-between pb-4 text-center text-sm-start">
          <h1 class="h3 mb-2 text-nowrap">Profile info</h1>
          <a class="btn btn-link text-danger fw-medium btn-sm mb-2" href="/">
            <i class="ai-trash-2 fs-base me-2"></i>Delete account
          </a>
        </div>
        <div class="bg-secondary rounded-3 p-4 mb-4">
          <div class="d-block d-sm-flex align-items-center">
            <img class="d-block rounded-circle mx-sm-0 mx-auto mb-3 mb-sm-0" src={main} alt="Amanda Wilson" width="110" />
            <div class="ps-sm-3 text-center text-sm-start">
              <button class="btn btn-light shadow btn-sm mb-2" type="button"><i class="ai-refresh-cw me-2"></i>Change avatar</button>
              <div class="p mb-0 fs-ms text-muted">Upload JPG, GIF or PNG image. 300 x 300 required.</div>
            </div>
          </div>
        </div>
        <Form />
      </div>
    </div>
  </div>
);

export default ProfileInfo;
