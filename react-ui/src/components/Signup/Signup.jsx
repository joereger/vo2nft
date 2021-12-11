import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import AccountNavbar from "../AccountNavbar";
import bgImage from '../../img/account/signin-img.jpg';


const Signup = () => {
  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  
  const handleSubmit = (e) => {
      e.preventDefault();
      alert(`Submitted: ${name} ${email} ${password} ${confirmpassword}`)
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
                        <h1 className="h2">Sign up</h1>
                        <p className="fs-ms text-muted mb-4">Registration takes less than a minute but gives you full control over your orders.</p>
                        <form onSubmit={e => {handleSubmit(e)}} className="needs-validation" novalidate>
                          <div className="mb-3">
                            <input value={name} onChange={e => setName(e.target.value)} className="form-control" type="text" placeholder="Full name" required/>
                          </div>
                          <div className="mb-3">
                            <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" type="text" placeholder="Email" required/>
                          </div>
                          <div className="input-group mb-3">
                            <div className="password-toggle w-100">
                              <input value={password} onChange={e => setPassword(e.target.value)} className="form-control" type="password" placeholder="Password" required/>
                              <label className="password-toggle-btn" aria-label="Show/hide password">
                                <input className="password-toggle-check" type="checkbox"/><span className="password-toggle-indicator"></span>
                              </label>
                            </div>
                          </div>
                          <div className="input-group mb-3">
                            <div className="password-toggle w-100">
                              <input value={confirmpassword} onChange={e => setConfirmpassword(e.target.value)} className="form-control" type="password" placeholder="Confirm password" required/>
                              <label className="password-toggle-btn" aria-label="Show/hide password">
                                <input className="password-toggle-check" type="checkbox"/><span className="password-toggle-indicator"></span>
                              </label>
                            </div>
                          </div>
                          <button className="btn btn-primary d-block w-100" type="submit">Sign up</button>
                          <p className="fs-sm pt-3 mb-0">Already have an account? <NavLink className="fw-medium" to="/Signin" activeclassname="active">Sign In</NavLink></p>
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

export default Signup;
