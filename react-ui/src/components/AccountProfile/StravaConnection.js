//import { useEffect, useState } from "react";
import React, { useContext, useState, useEffect } from "react"
import { NavLink } from 'react-router-dom';
import AccountNavbar from "../AccountNavbar";
import bgImage from '../../img/account/signin-img.jpg';
import { UserContext } from "../UserContext"
import { useNavigate, useParams } from "react-router-dom"
import AccountSideBar from "./AccountSideBar";

const StravaConnection = () => {

  const [newPassword, setNewPassword] = useState("");
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();
  const [userContext, setUserContext] = useContext(UserContext)

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }

    var stravaAuthUrl = "https://www.strava.com/oauth/authorize?"
    stravaAuthUrl = stravaAuthUrl + "client_id="+process.env.REACT_APP_STRAVA_CLIENT_ID+"&"
    stravaAuthUrl = stravaAuthUrl + "redirect_uri="+window.location.origin+"/strava-callback/&"
    stravaAuthUrl = stravaAuthUrl + "response_type=code&"
    stravaAuthUrl = stravaAuthUrl + "scope=read,activity:read&"
    stravaAuthUrl = stravaAuthUrl + "state=foo"

    console.log("stravaAuthUrl="+stravaAuthUrl);
    //Redirect user
    window.location.replace(stravaAuthUrl);
  }


  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')
  return (
    <>
      

          <div class="col-lg-8">
            <div class="d-flex flex-column h-100 bg-light rounded-3 shadow-lg p-4">
              <div class="py-2 p-md-3">
                <div class="d-sm-flex align-items-center justify-content-between pb-4 text-center text-sm-start">
                  <h1 class="h3 mb-2 text-nowrap">Strava Connection</h1>
                  <a class="btn btn-link text-danger fw-medium btn-sm mb-2" href="/">
                    <i class="ai-trash-2 fs-base me-2"></i>Disconnect account
                  </a>
                </div>
                {isAlertOn 
                      ? <div class="alert d-flex alert-primary" role="alert"><i class="ai-bell fs-xl me-3"></i><div> {alertText} </div></div>
                      : ''
                }


                <form onSubmit={e => {handleSubmit(e)}} className="needs-validation" noValidate>
                  <button className="btn btn-primary d-block w-100" type="submit">Connect Strava</button>
                </form>
                


              </div>
            </div>
          </div>

    </>
  )
}

export default StravaConnection;
