import { useEffect } from "react";
import AccountNavbar from "./AccountNavbar";
import ProfileInfo from "./Profile Info/ProfileInfo";
import SideBar from "./SideBar";

const AccountProfile = () => {
  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')
  return (
    <>
      <AccountNavbar />
      <div className="position-relative bg-gradient" style={{height: '480px'}}>
        <div className="shape shape-bottom shape-slant bg-secondary d-none d-lg-block">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 260">
            <polygon fill="currentColor" points="0,257 0,260 3000,260 3000,0"></polygon>
          </svg>
        </div>
      </div>
      <div class="container position-relative zindex-5 pb-4 mb-md-3" style={{marginTop: '-350px'}}>
        <div class="row">
          <SideBar />
          <ProfileInfo />
        </div>
      </div>
    </>
  )
}

export default AccountProfile;
