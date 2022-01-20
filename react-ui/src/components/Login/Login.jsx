//import { useEffect, useState } from "react";
import React, { useContext, useState, useEffect } from "react"
import { NavLink } from 'react-router-dom';
import AccountNavbar from "../AccountNavbar";
import bgImage from '../../img/account/signin-img.jpg';
import { UserContext } from "../UserContext"
import { useNavigate, useParams } from "react-router-dom"

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();

  const [userContext, setUserContext] = useContext(UserContext)

  const handleSubmit = (e) => {
      e.preventDefault();

      console.log(`Login Submitted: ${email} ${password}`)
      console.log("BEFORE LOGIN userContext="+JSON.stringify(userContext));

      return fetch(process.env.REACT_APP_NODE_URI + '/api/login', {
          method: 'POST',
          credentials: "include",
          body: JSON.stringify({ email, password }),
          headers: {
              'Content-Type': 'application/json'
          }
      }).then(response => {
          if (response.status >= 200 && response.status < 300) {
            //return(response);
            console.log("LOGIN: received a response; user is authed and token will be stored");
            response.json().then(json => {
              console.log(json);
              //Save the token in the UserContext
              setUserContext(oldValues => {
                return { ...oldValues, token: json.token }
              })
              //Save the user in the UserContext
              setUserContext(oldValues => {
                return { ...oldValues, user: json.user }
              })
              console.log("token set token="+json.token);

              
              console.log("AFTER LOGIN/ABOUT TO REDIRECT userContext="+JSON.stringify(userContext));
              
              setIsAlertOn(false);
              //Redirect user
              navigate("/account-profile");
            });
          } else if (response.status >= 400 && response.status < 600){
            console.log("/api/login 401 unauthorized");
            setAlertText("Sorry, the login authorities tell me that your request is unauthorized.  Please try again or consider resetting your password.");
            setIsAlertOn(true);
          } else {
            response.json().then(json => {
              console.log(json);
              console.log('LOGIN: Somthing blew up message='+json.message);
              setAlertText(json.message);
              setIsAlertOn(true);
            });
            
          }
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

                        <h1 className="h2">Log in</h1>
                        <p className="fs-ms text-muted mb-4">Sign in to your account using email and password provided during registration.</p>
                        <form onSubmit={e => {handleSubmit(e)}} className="needs-validation" noValidate>
                          <div className="input-group mb-3"><i className="ai-mail position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                            <input value={email} onChange={e => setEmail(e.target.value)} className="form-control rounded" type="email" placeholder="Email" required/>
                          </div>
                          <div className="input-group mb-3"><i className="ai-lock position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                            <div className="password-toggle w-100">
                              <input value={password} onChange={e => setPassword(e.target.value)} className="form-control" type="password" placeholder="Password" required/>
                              <label className="password-toggle-btn" aria-label="Show/hide password">
                                <input className="password-toggle-check" type="checkbox"/><span className="password-toggle-indicator"></span>
                              </label>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3 pb-1">
                            <div className="form-check">
                              {/*  
                              <input onChange={e => setKeepmesignedin(e.target.value)} className="form-check-input" type="checkbox" id="keep-signed-2"/>
                              <label className="form-check-label" for="keep-signed-2">Keep me signed in</label>
                              */}
                            </div><NavLink className="nav-link-style fs-ms" to="/forgot-password">Forgot password?</NavLink>
                          </div>
                          <button className="btn btn-primary d-block w-100" type="submit">Log in</button>
                          <p className="fs-sm pt-3 mb-0">Don't have an account? <NavLink className="fw-medium" to="/Signup" activeclassname="active">Sign Up</NavLink></p>
                          
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

export default Login;
