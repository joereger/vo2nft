import React, { useContext, useState, useEffect, useCallback } from "react"
import { NavLink } from 'react-router-dom';
import main from '../../img/dashboard/avatar/main.jpg';
import { UserContext } from "../UserContext"

const Workouts = () => {

  const [workouts, setWorkouts] = useState([]); 
  
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [userContext, setUserContext] = useContext(UserContext)

  useEffect(() => {
      console.log("Loading User profile info");
    
      fetch(process.env.REACT_APP_NODE_URI + '/api/workouts', {
          method: 'GET',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`
          }
      }).then(response => {
          if (response.status >= 200 && response.status < 300) {
            //return(response);
            console.log("Workouts: received a response");
            response.json().then(json => {
                console.log(json);
                setWorkouts(json.workouts);
        
            });
          } else if (response.status >= 400 && response.status < 600){
            console.log("/api/workouts 401 unauthorized");
            setAlertText("Sorry, the login authorities tell me that your request is unauthorized.  Please try again or consider resetting your password.");
            setIsAlertOn(true);
          } else {
            response.json().then(json => {
              console.log(json);
              console.log('Workouts UPDATE: Somthing blew up message='+json.message);
              setAlertText(json.message);
              setIsAlertOn(true);
            });
            
          }
      }).catch(err => err);
    
    }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Workouts handleSubmit() called`)
}

return(

    <div class="col-lg-8">
        <div class="d-flex flex-column h-100 bg-light rounded-3 shadow-lg p-4">
          <div class="py-2 p-md-3">
            <div class="d-sm-flex align-items-center justify-content-between pb-4 text-center text-sm-start">
              <h1 class="h3 mb-2 text-nowrap">Workouts</h1>
            </div>
            

            <div class="container">
              <div class="row">


              {workouts.map((workout) => (
                
                <div class="col">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">{workout.title}</h5>
                      <p class="card-text fs-sm">{workout.description}</p>
                      <p class="card-text fs-sm">{workout.workout_date}</p>
                      <a href="#" class="btn btn-sm btn-primary">Buy Workout NFT</a>
                    </div>
                  </div>
                </div>



              ))}


              </div>
            </div>

          </div>
        </div>
      </div>
      )

};

export default Workouts
