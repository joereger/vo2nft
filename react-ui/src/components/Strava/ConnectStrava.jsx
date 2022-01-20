import React, { useContext, useState, useEffect } from "react"
import AccountNavbar from "../AccountNavbar";
import { UserContext } from "../UserContext"
import { useNavigate, useParams } from "react-router-dom"

const ConnectStrava = () => {

    console.log("ConnectStrava called");

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
    //window.location.replace(stravaAuthUrl);
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

                        <h1 className="h2">Connect your Strava account</h1>
                        <p className="fs-ms text-muted mb-4">We only look at public workouts and public profile info.  We don't post to your Strava account.</p>
                        <form onSubmit={e => {handleSubmit(e)}} className="needs-validation" noValidate>
                   
                          
                          <button className="btn btn-primary d-block w-100" type="submit">Connect Strava</button>
                          
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

export default ConnectStrava;
