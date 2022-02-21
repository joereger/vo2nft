import React, { useContext, useState, useEffect } from "react"
import { NavLink } from 'react-router-dom';
import AccountNavbar from "../AccountNavbar";
import bgImage from '../../img/account/signin-img.jpg';
import { useNavigate } from "react-router-dom"
import { UserContext } from "../UserContext"
import SignupRightCol from "./SignupRightCol";


const Signup = () => {
  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  //const [confirmpassword, setConfirmpassword] = useState("");

  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [responseData, setResponseData] = useState(null);

  const [userContext, setUserContext] = useContext(UserContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (userContext?.strava_data?.athlete?.firstname && userContext?.strava_data?.athlete?.lastname){
      setName(userContext?.strava_data?.athlete?.firstname+' '+userContext?.strava_data?.athlete?.lastname);
    }
    if (userContext?.strava_data?.athlete?.username){
      setUsername(userContext?.strava_data?.athlete?.username);
    }
  
  }, []);

  const handleSubmit = (e) => {
      e.preventDefault();

      console.log(`Signup Submitted: ${email} ${password}`)

      const strava_data = userContext?.strava_data
      // const strava_access_token = userContext?.strava_data?.data?.access_token
      // console.log("strava_access_token"+strava_access_token);
      // const strava_refresh_token = userContext?.strava_data?.data?.refresh_token
      // console.log("strava_refresh_token"+strava_refresh_token);
      // const strava_access_token_expires_at = userContext?.strava_data?.data?.expires_at
      // console.log("strava_access_token_expires_at"+strava_access_token_expires_at);

      return fetch(process.env.REACT_APP_NODE_URI + '/api/signup', {
          method: 'POST',
          credentials: "include",
          body: JSON.stringify({ email, password, name, username, strava_data }),
          headers: {
              'Content-Type': 'application/json'
          }
      }).then(response => {
          if (response.status >= 200 && response.status < 300) {
            //return(response);
            console.log("Signup: received a response");
            response.json().then(json => {
              console.log(json);

              //Save the user and token in the UserContext
              setUserContext(oldValues => {
                return { ...oldValues, user: json.user, token: json.token, stravaAccount: json?.stravaAccount}
              })
 
            
              console.log("token set token="+json.token);
              setIsAlertOn(false);
              //Redirect user
              navigate("/account");
            });
          } else {
            response.json().then(json => {
              console.log(json);
              console.log('Signup: Somthing blew up message='+json.message);
              setAlertText(json.message);
              setIsAlertOn(true);
            });
            
          }
      }).catch(err => err);

  }

  

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
          
                      {/* Sign Up View */}
                      <div className="view show" id="signup-view">

                      {isAlertOn 
                            ? <div class="alert d-flex alert-primary" role="alert"><i class="ai-bell fs-xl me-3"></i><div> {alertText} </div></div>
                            : ''
                      }

                      {userContext?.strava_data?.athlete?.username 
                            ? 
                            <>
                            <div class="container">
                              <div class="row">
                                <div class="col">
                                  <img src={userContext?.strava_data?.athlete?.profile} alt="Strava User" className="img-thumbnail rounded-circle"></img>
                                  <br/><br/>
                                </div>
                                <div class="col">
                                  <h1 className="h2">Success!</h1>
                                  <p className="fs-ms text-muted mb-4">We're connected to Strava, let's get started...</p>
                                </div>
                              </div>
                            </div>
                            </>
                            : 
                            <>
                            <h1 className="h2">Sign up</h1>
                            <p className="fs-ms text-muted mb-4">Takes less than a minute but gives you access to a world of endurance sports NFTs.</p>
                            </>
                      }


                    
                        
                        
                        
                        <form onSubmit={e => {handleSubmit(e)}} className="needs-validation" noValidate>
                          <div className="mb-3">
                            <input value={name} onChange={e => setName(e.target.value)} className="form-control" type="text" placeholder="Name" required/>
                          </div>
                          <div className="mb-3">
                            <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" type="text" placeholder="Email" required/>
                          </div>
                          <div className="mb-3">
                            <div class="input-group">
                              <span class="input-group-text">@</span>
                              <input value={username} onChange={e => setUsername(e.target.value)} className="form-control" type="text" placeholder="Username" required/>
                            </div>
                          </div>
                          <div className="input-group mb-3">
                            <div className="password-toggle w-100">
                              <input value={password} onChange={e => setPassword(e.target.value)} className="form-control" type="password" placeholder="Password" required/>
                              <label className="password-toggle-btn" aria-label="Show/hide password">
                                <input className="password-toggle-check" type="checkbox"/><span className="password-toggle-indicator"></span>
                              </label>
                            </div>
                          </div>
                          {/* <div className="input-group mb-3">
                            <div className="password-toggle w-100">
                              <input value={confirmpassword} onChange={e => setConfirmpassword(e.target.value)} className="form-control" type="password" placeholder="Confirm password" required/>
                              <label className="password-toggle-btn" aria-label="Show/hide password">
                                <input className="password-toggle-check" type="checkbox"/><span className="password-toggle-indicator"></span>
                              </label>
                            </div>
                          </div> */}
                          <button className="btn btn-primary d-block w-100" type="submit">Continue</button>
                          <p className="fs-sm pt-3 mb-0">Already have an account? <NavLink className="fw-medium" to="/Login" activeclassname="active">Log In</NavLink></p>
                        </form>
                      </div>


                      
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>

          <SignupRightCol />

        </div>
      </div>

    </>
  )
}

export default Signup;
