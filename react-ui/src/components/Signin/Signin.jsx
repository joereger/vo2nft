import { useEffect } from "react";
import { NavLink } from 'react-router-dom';
import AccountNavbar from "../AccountNavbar";
import bgImage from '../../img/account/signin-img.jpg';


const Signin = () => {
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
                      {/* Sign In View */}
                      <div className="view show" id="signin-view">
                        <h1 className="h2">Sign in</h1>
                        <p className="fs-ms text-muted mb-4">Sign in to your account using email and password provided during registration.</p>
                        <form className="needs-validation" novalidate>
                          <div className="input-group mb-3"><i className="ai-mail position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                            <input className="form-control rounded" type="email" placeholder="Email" required/>
                          </div>
                          <div className="input-group mb-3"><i className="ai-lock position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                            <div className="password-toggle w-100">
                              <input className="form-control" type="password" placeholder="Password" required/>
                              <label className="password-toggle-btn" aria-label="Show/hide password">
                                <input className="password-toggle-check" type="checkbox"/><span className="password-toggle-indicator"></span>
                              </label>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3 pb-1">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" id="keep-signed-2"/>
                              <label className="form-check-label" for="keep-signed-2">Keep me signed in</label>
                            </div><a className="nav-link-style fs-ms" href="password-recovery.html">Forgot password?</a>
                          </div>
                          <button className="btn btn-primary d-block w-100" type="submit">Sign in</button>
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

export default Signin;
