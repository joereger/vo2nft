import React, { useEffect, useContext } from "react";
import AccountNavbar from "../AccountNavbar";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import SideBar from "./SideBar";

const AccountProfile = () => {

  
  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')
  return(
    <>
      <AccountNavbar />

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
