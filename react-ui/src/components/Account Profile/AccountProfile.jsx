import React, { useEffect, useContext } from "react";
import AccountNavbar from "../AccountNavbar";
import ProfileInfo from "./Profile Info/ProfileInfo";
import SideBar from "./SideBar";

const AccountProfile = () => {
//class AccountProfile extends React.Component {
  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')
  //console.log("ACCOUNT PROFILE userContext="+JSON.stringify(userContext));

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
