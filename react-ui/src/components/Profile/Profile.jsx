import React, { useEffect, Routes, Route, BrowserRouter } from "react";
import { Outlet } from 'react-router-dom';
import AccountNavbar from "../AccountNavbar";
import ProfileSideBar from "./ProfileSideBar";


const Profile = () => {

  
  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')
  return(
    <>
      <AccountNavbar />

      <div className="container position-relative zindex-5 pb-4 mb-md-3" style={{marginTop: '-350px'}}>
        <div className="row">
          <ProfileSideBar />

          <Outlet />

        </div>
      </div>


    </>
  )
}

export default Profile;
