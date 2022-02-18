import React, { useContext, useState, useEffect, useCallback } from "react"
import { NavLink, useParams } from 'react-router-dom';
import main from '../../img/dashboard/avatar/main.jpg';
import { UserContext } from "../UserContext"

const ProfileMain = () => {

  const [user, setUser] = useState();
  const [workouts, setWorkouts] = useState([]);
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [userContext, setUserContext] = useContext(UserContext)
  const { username } = useParams();

  useEffect(() => {
      console.log("Loading User profile");

      fetch(process.env.REACT_APP_NODE_URI + '/api/profile/'+ username, {
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
    
                setUser(json.user);
                if (json.workouts != null){
                  setWorkouts(json.workouts);
                  console.log("setting json.workouts="+json.workouts);
                }
                //setAlertText("Saved.  Thanks!");
                //setIsAlertOn(false);
            });
          } else if (response.status >= 400 && response.status < 600){
            console.log("/api/profile 401 unauthorized");
            setAlertText("Sorry, the login authorities tell me that your request is unauthorized.  Please try again or consider resetting your password.");
            setIsAlertOn(true);
          } else {
            response.json().then(json => {
              console.log(json);
              console.log('PROFILE: Somthing blew up message='+json.message);
              setAlertText(json.message);
              setIsAlertOn(true);
            });
            
          }
      }).catch(err => err);
    
    }, [])

  

return(

    <div class="col-lg-8">
        <div class="d-flex flex-column h-100 bg-light rounded-3 shadow-lg p-4">
          <div class="py-2 p-md-3">
            <div class="d-sm-flex align-items-center justify-content-between pb-4 text-center text-sm-start">
              <h1 class="h3 mb-2 text-nowrap">Profile</h1>
            </div>
            
            <div class="row">

              {isAlertOn 
                ? <div class="alert d-flex alert-primary" role="alert"><i class="ai-bell fs-xl me-3"></i><div> {alertText} </div></div>
                : ''
              }

              <div className="container">
              <div className="row">


              {workouts.map((workout) => (
                
                <div key={workout.id} className="col">
                  <div className="card" style={{marginTop: '10px'}}>
                    <div className="card-body">
                      <h5 className="card-title">{workout.title}</h5>
                      <p className="card-text fs-sm">{workout.description}</p>
                      <p className="card-text fs-sm">{workout.workout_date}</p>
                      <a href="#" className="btn btn-sm btn-primary">Buy Workout NFT</a>
                    </div>
                  </div>
                </div>



              ))}


              </div>
            </div>            



            </div>

          </div>
        </div>
      </div>
      )

};

export default ProfileMain
