//import { useEffect, useState } from "react";
import React, { useContext, useState, useEffect } from "react"
import { NavLink } from 'react-router-dom';
import { UserContext } from "../UserContext"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import { useQuery } from 'react-query'


const DefaultPrice = () => {

  const [newDefaultPrice, setNewDefaultPrice] = useState("");
  const [ethPriceInUSD, setEthPriceInUSD] = useState("");
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();
  const [userContext, setUserContext] = useContext(UserContext)

  const { data: me } = useQuery(["me", userContext.user.id], () =>
    axios.get( process.env.REACT_APP_NODE_URI + '/api/me/',
      { enabled: true, withCredentials: true, headers: { Authorization: `Bearer ${userContext.token}` } }
    ).then((res) => res.data),
    {
      onSuccess: (data) => {
        console.log("got data from backend: "+JSON.stringify(data));
        if (data?.default_price_in_eth && data?.default_price_in_eth>0){
          setNewDefaultPrice(data.default_price_in_eth * 1000);
        } else {
          //setNewDefaultPrice(.001);
        }
        
      }
    }
  );

  useEffect(() => {
    
    //Get current ETH->USD price
    fetch(process.env.REACT_APP_NODE_URI + '/api/ethtousd', {
        method: 'GET',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
        }
    }).then(response => {
        if (response.status >= 200 && response.status < 300) {
          response.json().then(json => {
              setEthPriceInUSD(json.usd);
          });
        } else {
          console.log("/api/ethtousd api error");
        }
    }).catch(err => err);

    //Set catch-all price
    setNewDefaultPrice(1); 
  
  }, [])

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log(`/API/DEFAULTPRICE saving: ${newDefaultPrice/1000}`)

      return fetch(process.env.REACT_APP_NODE_URI + '/api/defaultprice', {
          method: 'POST',
          credentials: "include",
          body: JSON.stringify({ default_price_in_eth: newDefaultPrice/1000 }),
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`
          }
      }).then(response => {
          if (response.status >= 200 && response.status < 300) {
            console.log("/API/DEFAULTPRICE: received a response; default price is set");
            response.json().then(json => {
              console.log(json);
              //Save the user in the UserContext
              setUserContext(oldValues => {
                return { ...oldValues, user: json.user }
              })
              console.log("/API/DEFAULTPRICE: token set token="+json.token);
              
              setAlertText("Saved!");
              setIsAlertOn(true);

            });
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

  const handleRangeSlide = (e) => {
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
                      ? <div className="alert d-flex alert-primary" role="alert"><i class="ai-bell fs-xl me-3"></i><div> {alertText} </div></div>
                      : ''
                }
                <form onSubmit={e => {handleSubmit(e)}} className="needs-validation" noValidate>
                  {/* <div className="input-group mb-3"><i className="ai-lock position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                    <div className="password-toggle w-100">
                      <input value={newDefaultPrice} onChange={e => setNewDefaultPrice(e.target.value)} className="form-control" type="text" placeholder="Default Price" required/>
                    </div>
                  </div> */}

                  <div className="mb-4 mt-4">
                    <center><h2>{(newDefaultPrice/1000).toFixed(6)} ETH</h2></center>
                    <center><h4>${((newDefaultPrice/1000) * ethPriceInUSD).toFixed(2)}</h4></center>
                  </div>

                  <div class="mb-4 mt-4">
                    <input type="range" value={newDefaultPrice} className="form-range" min="1" max="100" step=".01" id="customRange1" onChange={handleRangeSlide}></input>
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
