import React, { useContext, useState, useEffect } from "react"
import { NavLink } from 'react-router-dom';
import AccountNavbar from "../AccountNavbar";
import bgImage from '../../img/account/signin-img.jpg';
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../UserContext"


const SignupRightCol = () => {
  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')

  

  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [responseData, setResponseData] = useState(null);

  const [userContext, setUserContext] = useContext(UserContext)

  console.log("SignupRightCol userContext="+JSON.stringify(userContext));

  if (userContext.strava_data ){

    return (
      <>
  
  
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="bg-light rounded-3 shadow-lg">
                <section className="container d-flex align-items-center pt-7 pb-3 pb-md-4" style={{flex: '1 0 auto'}}>
                    <div className="w-100 pt-3">
                      <div className="row">
                        <div className="col-lg-9 col-md-6 offset-lg-1">

                        
                        
                        </div>
                      </div>
                    </div>
                </section>
              </div>
            </div>
  
      </>
    )

  } else {
    return (
      <>
  
  
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="bg-light rounded-3 shadow-lg">
                <section className="container d-flex align-items-center pt-7 pb-3 pb-md-4" style={{flex: '1 0 auto'}}>
                    <div className="w-100 pt-3">
                      <div className="row">
                        <div className="col-lg-9 col-md-6 offset-lg-1">
                        
                          Other stuff
                        
                        </div>
                      </div>
                    </div>
                </section>
              </div>
            </div>
  
      </>
    )  
  }


}

export default SignupRightCol;
