//import { useEffect, useState } from "react";
import React, { useContext, useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import { UserContext } from "../UserContext"
import { useNavigate } from "react-router-dom"

const StravaConnection = () => {

  const [stravaAccount, setStravaAccount] = useState(); 
  
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [userContext, setUserContext] = useContext(UserContext)
  const navigate = useNavigate();

  useEffect(() => {
      console.log("Loading StravaAccount");
    
      fetch(process.env.REACT_APP_NODE_URI + '/api/stravaaccount', {
          method: 'GET',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`
          }
      }).then(response => {
          if (response.status >= 200 && response.status < 300) {
            //return(response);
            console.log("StravaAccount: received a response");
            response.json().then(json => {
                console.log(json);
                setStravaAccount(json);
            });
          } else if (response.status >= 400 && response.status < 600){
            console.log("/api/stravaaccount 401 unauthorized");
            setAlertText("Sorry, the login authorities tell me that your request is unauthorized.  Please try again or consider resetting your password.");
            setIsAlertOn(true);
          } else {
            response.json().then(json => {
              console.log(json);
              console.log('StravaAccount UPDATE: Somthing blew up message='+json.message);
              setAlertText(json.message);
              setIsAlertOn(true);
            });
            
          }
      }).catch(err => err);
    
    }, [])


    const disconnectStravaAccount = (e) => {
      console.log("Disconnect StravaAccount");
    
      fetch(process.env.REACT_APP_NODE_URI + '/api/stravaaccount', {
          method: 'DELETE',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`
          }
      }).then(response => {
          if (response.status >= 200 && response.status < 300) {
            //return(response);
            console.log("StravaAccountDisconnect: received a response");
            response.json().then(json => {
                console.log(json);
                setStravaAccount(null);
                setAlertText("Success, your Strava account has been disconnected.  You can reconnect at any time.");
                setIsAlertOn(true);
            });
          } else if (response.status >= 400 && response.status < 600){
            console.log("/api/stravaaccountdisconnect 401 unauthorized");
            setAlertText("Sorry, the login authorities tell me that your request is unauthorized.  Please try again or consider resetting your password.");
            setIsAlertOn(true);
          } else {
            response.json().then(json => {
              console.log(json);
              console.log('StravaAccountDisconnect UPDATE: Somthing blew up message='+json.message);
              setAlertText(json.message);
              setIsAlertOn(true);
            });
            
          }
      }).catch(err => err);
    
    }

    const redirToConnectStrava = (e) => {
      navigate("/connect-strava");
    }


  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')
  return (
    <>
      

          <div class="col-lg-8">
            <div class="d-flex flex-column h-100 bg-light rounded-3 shadow-lg p-4">
              <div class="py-2 p-md-3">
                <div class="d-sm-flex align-items-center justify-content-between pb-4 text-center text-sm-start">
                  <h1 class="h3 mb-2 text-nowrap">Strava Connection</h1>
                  {(stravaAccount && stravaAccount.refresh_token)
                      ? <Link to="" onClick={disconnectStravaAccount} class="btn btn-link text-danger fw-medium btn-sm mb-2">
                          <i class="ai-trash-2 fs-base me-2"></i>Disconnect account
                        </Link>
                      : ''
                  }
                </div>
                {isAlertOn 
                      ? <div class="alert d-flex alert-primary" role="alert"><i class="ai-bell fs-xl me-3"></i><div> {alertText} </div></div>
                      : ''
                }


                {(stravaAccount && stravaAccount.refresh_token)
                      ? <div> Great!  Your Strava account is connected:  {stravaAccount?.username} </div>
                      : <form onSubmit={e => {redirToConnectStrava(e)}} className="needs-validation" noValidate>
                          <button className="btn btn-primary d-block w-100" type="submit">Connect Strava</button>
                        </form>
                }
                
                
                


              </div>
            </div>
          </div>

    </>
  )
}

export default StravaConnection;
