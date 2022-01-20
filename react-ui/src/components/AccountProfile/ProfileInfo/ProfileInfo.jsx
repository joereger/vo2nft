import React, { useContext, useState, useEffect, useCallback } from "react"
import { NavLink } from 'react-router-dom';
import main from '../../../img/dashboard/avatar/main.jpg';
import { UserContext } from "../../UserContext"

const ProfileInfo = () => {

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [userContext, setUserContext] = useContext(UserContext)

  useEffect(() => {
      console.log("Loading User profile info");
    
      fetch(process.env.REACT_APP_NODE_URI + '/api/me', {
          method: 'GET',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`
          }
      }).then(response => {
          if (response.status >= 200 && response.status < 300) {
            //return(response);
            console.log("ME: received a response;");
            response.json().then(json => {
                console.log(json);
    
                setName(json.name);
                setEmail(json.email);
                setUsername(json.username);
    
                //setAlertText("Saved.  Thanks!");
                //setIsAlertOn(false);
            });
          } else if (response.status >= 400 && response.status < 600){
            console.log("/api/me 401 unauthorized");
            setAlertText("Sorry, the login authorities tell me that your request is unauthorized.  Please try again or consider resetting your password.");
            setIsAlertOn(true);
          } else {
            response.json().then(json => {
              console.log(json);
              console.log('ME UPDATE: Somthing blew up message='+json.message);
              setAlertText(json.message);
              setIsAlertOn(true);
            });
            
          }
      }).catch(err => err);
    
    }, [])

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(`ME UPDATE Submitted: ${email}`)
    console.log("BEFORE ME UPDATE userContext="+JSON.stringify(userContext));

    return fetch(process.env.REACT_APP_NODE_URI + '/api/me', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({ email, username, name }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
        }
    }).then(response => {
        if (response.status >= 200 && response.status < 300) {
          //return(response);
          console.log("ME UPDATE: received a response; user is authed and token will be stored");
          response.json().then(json => {
              console.log(json);
              setUserContext(oldValues => {
                return { ...oldValues, user: json.user }
              })

              setAlertText("Saved.  Thanks!");
              setIsAlertOn(true);
          });
        } else {
          response.json().then(json => {
            console.log(json);
            console.log('ME UPDATE: Somthing blew up message='+json.message);
            setAlertText(json.message);
            setIsAlertOn(true);
          });
          
        }
    }).catch(err => err);

}

return(

    <div class="col-lg-8">
        <div class="d-flex flex-column h-100 bg-light rounded-3 shadow-lg p-4">
          <div class="py-2 p-md-3">
            <div class="d-sm-flex align-items-center justify-content-between pb-4 text-center text-sm-start">
              <h1 class="h3 mb-2 text-nowrap">Profile info</h1>
              {/* <a class="btn btn-link text-danger fw-medium btn-sm mb-2" href="/">
                <i class="ai-trash-2 fs-base me-2"></i>Delete account
              </a> */}
            </div>
            {/* <div class="bg-secondary rounded-3 p-4 mb-4">
              <div class="d-block d-sm-flex align-items-center">
                <img class="d-block rounded-circle mx-sm-0 mx-auto mb-3 mb-sm-0" src={main} alt="Amanda Wilson" width="110" />
                <div class="ps-sm-3 text-center text-sm-start">
                  <button class="btn btn-light shadow btn-sm mb-2" type="button"><i class="ai-refresh-cw me-2"></i>Change avatar</button>
                  <div class="p mb-0 fs-ms text-muted">Upload JPG, GIF or PNG image. 300 x 300 required.</div>
                </div>
              </div>
            </div> */}


            <div class="row">

              {isAlertOn 
                ? <div class="alert d-flex alert-primary" role="alert"><i class="ai-bell fs-xl me-3"></i><div> {alertText} </div></div>
                : ''
              }

              <form onSubmit={e => {handleSubmit(e)}} className="needs-validation" noValidate>

                <div className="mb-3 pb-1">
                  <input id="account-name" value={name} onChange={e => setName(e.target.value)} className="form-control" type="text" placeholder="Name" required/>
                </div>



                <div className="mb-3 pb-1">
                  <input id="account-email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" type="text" placeholder="Email" required/>
                </div>



                <div className="mb-3 pb-1">
                  <div class="input-group">
                    <span class="input-group-text">@</span>
                    <input id="account-username" value={username} onChange={e => setUsername(e.target.value)} className="form-control" type="text" placeholder="Username" required/>
                  </div>
                </div>

                <button className="btn btn-primary d-block w-100" type="submit">Save info</button>
              
              </form>
            </div>

          </div>
        </div>
      </div>
      )

};

export default ProfileInfo
