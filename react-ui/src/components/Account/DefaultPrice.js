//import { useEffect, useState } from "react";
import React, { useContext, useState, useEffect } from "react"
import { NavLink } from 'react-router-dom';
import AccountNavbar from "../AccountNavbar";
import bgImage from '../../img/account/signin-img.jpg';
import { UserContext } from "../UserContext"
import { useNavigate, useParams } from "react-router-dom"
import AccountSideBar from "./AccountSideBar";


const DefaultPrice = () => {

  const [newDefaultPrice, setNewDefaultPrice] = useState("");
  const [ethPriceInUSD, setEthPriceInUSD] = useState("");
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();
  const [userContext, setUserContext] = useContext(UserContext)

  useEffect(() => {
    console.log("Loading eth price");
  
    fetch(process.env.REACT_APP_NODE_URI + '/api/ethtousd', {
        method: 'GET',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
        }
    }).then(response => {
        if (response.status >= 200 && response.status < 300) {
          console.log("/api/ethtousd: sent a response;");
          response.json().then(json => {
              console.log(json);
              setEthPriceInUSD(json.usd);
          });
        } else {
          console.log("/api/ethtousd api error");
        }
    }).catch(err => err);
  
  }, [])

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log(`/API/DEFAULTPRICE Submitted: ${newDefaultPrice}`)

      // return fetch(process.env.REACT_APP_NODE_URI + '/api/defaultprice', {
      //     method: 'POST',
      //     credentials: "include",
      //     body: JSON.stringify({ newPassword }),
      //     headers: {
      //         'Content-Type': 'application/json',
      //         Authorization: `Bearer ${userContext.token}`
      //     }
      // }).then(response => {
      //     if (response.status >= 200 && response.status < 300) {
      //       console.log("/API/CHANGEPASSWORD: received a response; user password is reset");
      //       response.json().then(json => {
      //         console.log(json);
      //         //Save the user in the UserContext
      //         setUserContext(oldValues => {
      //           return { ...oldValues, user: json.user }
      //         })
      //         console.log("/API/CHANGEPASSWORD: token set token="+json.token);
      //         console.log("/API/CHANGEPASSWORD: AFTER LOGIN/ABOUT TO REDIRECT userContext="+JSON.stringify(userContext));
              
      //         setIsAlertOn(false);

      //         //Redirect user
      //         navigate("/account");
      //       });
      //     } else if (response.status >= 400 && response.status < 600){
      //       console.log("/API/CHANGEPASSWORD: /api/changepassword 401 unauthorized");
      //       setAlertText("Sorry, the login authorities tell me that your request is not authorized.  Please try again.");
      //       setIsAlertOn(true);
      //     } else {
      //       response.json().then(json => {
      //         console.log(json);
      //         console.log('/API/CHANGEPASSWORD:: Somthing blew up message='+json.message);
      //         setAlertText(json.message);
      //         setIsAlertOn(true);
      //       });
            
      //     }
      // }).catch(err => err);

  }

  const handleRangeSlide = (e) => {
    console.log(e);
    setNewDefaultPrice(e.target.value);
  }


  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')
  return (
    <>
      

          <div class="col-lg-8">
            <div class="d-flex flex-column h-100 bg-light rounded-3 shadow-lg p-4">
              <div class="py-2 p-md-3">
                <div class="d-sm-flex align-items-center justify-content-between pb-4 text-center text-sm-start">
                  <h1 class="h3 mb-2 text-nowrap">Default Price</h1>
                </div>
                {isAlertOn 
                      ? <div class="alert d-flex alert-primary" role="alert"><i class="ai-bell fs-xl me-3"></i><div> {alertText} </div></div>
                      : ''
                }
                <form onSubmit={e => {handleSubmit(e)}} className="needs-validation" noValidate>
                  {/* <div className="input-group mb-3"><i className="ai-lock position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                    <div className="password-toggle w-100">
                      <input value={newDefaultPrice} onChange={e => setNewDefaultPrice(e.target.value)} className="form-control" type="text" placeholder="Default Price" required/>
                    </div>
                  </div> */}

                  <div class="mb-4 mt-4">
                    <center><h2>{(newDefaultPrice/1000).toFixed(6)} ETH</h2></center>
                    <center><h4>${((newDefaultPrice/1000) * ethPriceInUSD).toFixed(2)}</h4></center>
                  </div>

                  <div class="mb-4 mt-4">
                    <input type="range" className="form-range" min="1" max="100" step=".01" id="customRange1" onChange={handleRangeSlide}></input>
                  </div>

                  <button className="btn btn-primary d-block w-100" type="submit">Save</button>
                </form>
              </div>
            </div>
          </div>
    </>
  )
}

export default DefaultPrice;
