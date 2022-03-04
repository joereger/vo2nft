//import { useEffect, useState } from "react";
import React, { useContext, useState, useEffect } from "react"
import { NavLink } from 'react-router-dom';
import AccountNavbar from "../AccountNavbar";
import bgImage from '../../img/account/signin-img.jpg';
import { UserContext } from "../UserContext"
import { useNavigate, useParams } from "react-router-dom"
import AccountSideBar from "./AccountSideBar";

const ChangePassword = () => {

  const [newPassword, setNewPassword] = useState("");
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();
  const [userContext, setUserContext] = useContext(UserContext)

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log(`/API/CHANGEPASSWORD Submitted: ${newPassword}`)

      return fetch(process.env.REACT_APP_NODE_URI + '/api/changepassword', {
          method: 'POST',
          credentials: "include",
          body: JSON.stringify({ newPassword }),
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`
          }
      }).then(response => {
          if (response.status >= 200 && response.status < 300) {
            console.log("/API/CHANGEPASSWORD: received a response; user password is reset");
            response.json().then(json => {
              console.log(json);
              //Save the user in the UserContext
              setUserContext(oldValues => {
                return { ...oldValues, user: json.user }
              })
              console.log("/API/CHANGEPASSWORD: token set token="+json.token);
              console.log("/API/CHANGEPASSWORD: AFTER LOGIN/ABOUT TO REDIRECT userContext="+JSON.stringify(userContext));
              
              setIsAlertOn(false);

              //Redirect user
              navigate("/account");
            });
          } else if (response.status >= 400 && response.status < 600){
            console.log("/API/CHANGEPASSWORD: /api/changepassword 401 unauthorized");
            setAlertText("Sorry, the login authorities tell me that your request is not authorized.  Please try again.");
            setIsAlertOn(true);
          } else {
            response.json().then(json => {
              console.log(json);
              console.log('/API/CHANGEPASSWORD:: Somthing blew up message='+json.message);
              setAlertText(json.message);
              setIsAlertOn(true);
            });
            
          }
      }).catch(err => err);

  }


  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')
  return (
    <>
      

          <div class="col-lg-8">
            <div class="d-flex flex-column h-100 bg-light rounded-3 shadow-lg p-4">
              <div class="py-2 p-md-3">
                <div class="d-sm-flex align-items-center justify-content-between pb-4 text-center text-sm-start">
                  <h1 class="h3 mb-2 text-nowrap">Change Password</h1>
                  {/* <a class="btn btn-link text-danger fw-medium btn-sm mb-2" href="/">
                    <i class="ai-trash-2 fs-base me-2"></i>Delete account
                  </a> */}
                </div>
                {isAlertOn 
                      ? <div class="alert d-flex alert-primary" role="alert"><i class="ai-bell fs-xl me-3"></i><div> {alertText} </div></div>
                      : ''
                }
                <form onSubmit={e => {handleSubmit(e)}} className="needs-validation" noValidate>
                  <div className="input-group mb-3"><i className="ai-lock position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                    <div className="password-toggle w-100">
                      <input value={newPassword} onChange={e => setNewPassword(e.target.value)} className="form-control" type="password" placeholder="New Password" required/>
                      <label className="password-toggle-btn" aria-label="Show/hide password">
                        <input className="password-toggle-check" type="checkbox"/><span className="password-toggle-indicator"></span>
                      </label>
                    </div>
                  </div>
                  <button className="btn btn-primary d-block w-100" type="submit">Change Password</button>
                </form>
              </div>
            </div>
          </div>
    </>
  )
}

export default ChangePassword;
