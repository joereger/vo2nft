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

    var total_workouts = userContext?.strava_data?.all_swim_totals?.count +
                         userContext?.strava_data?.all_ride_totals?.count +
                         userContext?.strava_data?.all_run_totals?.count;

    return (
      <>
  
  
            <div className="col-lg-6 mb-4 mb-lg-0">
              {/* <div className="bg-light rounded-3 shadow-lg">
                <section className="container d-flex align-items-center pt-7 pb-3 pb-md-4" style={{flex: '1 0 auto'}}>
                    <div className="w-100 pt-3" style={{textAlign: 'center'}}> */}


                      <br/><br/><br/>
                      <span class="badge bg-secondary">{total_workouts} workouts</span><br/>
                      <h1 class="display-1 text-white">{total_workouts} NFTs</h1>
                        <p class="card-text fs-sm text-white"><b>Let's goooooooo!</b> We'll convert these to NFTs on the blockchain that you can sell.</p>
                      <br/><br/><br/><br/>
                      
                        
                    {/* <div class="card">
                      <div class="card-body">
                        <h5 class="card-title"><span class="badge bg-primary">{userContext?.strava_data?.athlete?.username}</span></h5>
                        <p class="card-text fs-sm"><img src={userContext?.strava_data?.athlete?.profile} alt="Strava User" className="img-thumbnail rounded-circle"></img></p>
                      </div>
                    </div> */}


                          
                           
                            

                          <div class="container">
                            <div class="row">
                              <div class="col">
                                <h1 class="display-3">{userContext?.strava_data?.all_swim_totals?.count}</h1>
                                Swim Workouts
                              </div>
                              <div class="col">
                                <h1 class="display-3">{userContext?.strava_data?.all_ride_totals?.count}</h1>
                                Bike Workouts
                              </div>
                              <div class="col">
                                <h1 class="display-3">{userContext?.strava_data?.all_run_totals?.count}</h1>
                                Run Workouts
                              </div>
                            </div>
                          </div>


                            



                      
                    {/* </div>
                </section>
              </div> */}
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
