import React, { useContext, useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { NavLink } from 'react-router-dom';
import workoutDefaultImg from '../../img/workout-default.png';
import { UserContext } from "../UserContext"
import { DateTime } from "luxon";

const getHumanReadable = (inDate) => {
  if (inDate){
    return DateTime.fromISO(inDate).toRelative()
  }
}

const Workout = () => {

  const [workout, setWorkout] = useState([]); 
  
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [userContext, setUserContext] = useContext(UserContext);

  const { workout_id_param } = useParams();

  useEffect(() => {
      console.log("Loading Workout from API");
    
      fetch(process.env.REACT_APP_NODE_URI + '/api/workout/'+workout_id_param, {
          method: 'GET',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`
          }
      }).then(response => {
          if (response.status >= 200 && response.status < 300) {
            //return(response);
            console.log("Workout: received a response");
            response.json().then(json => {
                console.log(JSON.stringify(json));
                if (json.workout != null){
                  setWorkout(json.workout);
                  console.log("setting json.workout="+JSON.stringify(json.workout));
                }
        
            });
          } else if (response.status >= 400 && response.status < 600){
            console.log("/api/workout 401 unauthorized");
            setAlertText("Sorry, the login authorities tell me that your request is unauthorized.  Please try again or consider resetting your password.");
            setIsAlertOn(true);
          } else {
            response.json().then(json => {
              console.log(json);
              console.log('Workout: Somthing blew up message='+json.message);
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

    <div>
        {workout.id}
    </div>
    
            

            
      )

};

export default Workout
