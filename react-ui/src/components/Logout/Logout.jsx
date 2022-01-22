//import { useEffect, useState } from "react";
import React, { useContext, useState, useEffect } from "react"
import { NavLink } from 'react-router-dom';
import AccountNavbar from "../AccountNavbar";
import bgImage from '../../img/account/signin-img.jpg';
import { UserContext } from "../UserContext"
import { useNavigate, useParams } from "react-router-dom"

const Logout = () => {

  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();

  const [userContext, setUserContext] = useContext(UserContext)

  const handleSubmit = (e) => {
      e.preventDefault();

      console.log(`LOGOUT Submitted`)
      console.log("BEFORE LOGOUT userContext="+JSON.stringify(userContext));

      return fetch(process.env.REACT_APP_NODE_URI + '/api/logout', {
          method: 'GET',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json'
          }
      }).then(response => {
          if (response.status >= 200 && response.status < 300) {
            console.log("LOGOUT: received a response; user is authed and token will be nulled");
            response.json().then(json => {
              console.log(json);
              //Save the token in the UserContext
              setUserContext(oldValues => {
                return { ...oldValues, token: null, user: null }
              })
              
              console.log("AFTER LOGOUT/ABOUT TO REDIRECT userContext="+JSON.stringify(userContext));
              
              setIsAlertOn(false);
              //Redirect user
              navigate("/");
            });
          } else if (response.status >= 400 && response.status < 600){
            console.log("/api/logout 401 unauthorized");
            setAlertText("Sorry, the login authorities tell me that your request is unauthorized.  Please try again or consider resetting your password.");
            setIsAlertOn(true);
          } else {
            response.json().then(json => {
              console.log(json);
              console.log('Logout: Somthing blew up message='+json.message);
              setAlertText(json.message);
              setIsAlertOn(true);
            });
          }
          console.log("boo");
      }).catch(err => err);

  }


  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')
  return (
    <>
      <AccountNavbar />

          
      {/*  
      <div className="d-none d-md-block position-absolute w-50 h-100 bg-size-cover" style={{top: "0px", right: "0px", backgroundImage: "url(" + bgImage + ")" }}></div>
      */} 

      <div class="container position-relative zindex-5 pb-4 mb-md-3" style={{marginTop: '-350px'}}>
        <div class="row">

          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="bg-light rounded-3 shadow-lg">

              <section className="container d-flex align-items-center pt-7 pb-3 pb-md-4" style={{flex: '1 0 auto'}}>
                <div className="w-100 pt-3">
                  <div className="row">
                    <div className="col-lg-9 col-md-6 offset-lg-1">
                      <div className="view show" id="signin-view">

                      {isAlertOn 
                            ? <div class="alert d-flex alert-primary" role="alert"><i class="ai-bell fs-xl me-3"></i><div> {alertText} </div></div>
                            : ''
                      }

                        <h1 className="h2">You sure?</h1>
                        {/* <p className="fs-ms text-muted mb-4">We'll see ya soon.</p> */}
                        <form onSubmit={e => {handleSubmit(e)}} className="needs-validation" noValidate>
                          
                          
                          <button className="btn btn-primary d-block w-100" type="submit">Log out</button>
                          <p className="fs-sm pt-3 mb-0">Just kidding? <NavLink className="fw-medium" to="/account-profile" activeclassname="active">Account Profile</NavLink></p>
                          <br/><br/>
                        </form>
                      </div>
                      



                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>

        </div>
      </div>

    </>
  )
}

export default Logout;
