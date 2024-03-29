import React, { useContext, useState, useEffect, useCallback } from "react"
import { NavLink, useParams } from 'react-router-dom';
import workoutDefaultImg from '../../img/workout-default.png';
import { UserContext } from "../UserContext"
import { DateTime } from "luxon";

const getHumanReadable = (inDate) => {
  if (inDate){
    return DateTime.fromISO(inDate).toRelative()
  }
}

const Workouts = () => {

  const [workouts, setWorkouts] = useState([]); 
  
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [userContext, setUserContext] = useContext(UserContext)
  const { username } = useParams();

  useEffect(() => {
      console.log("Loading User profile info, will call /api/user/"+username+"/workouts");
    
      fetch(process.env.REACT_APP_NODE_URI + '/api/user/'+username+'/workouts', {
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
                if (json.workouts != null){
                  setWorkouts(json.workouts);
                  //console.log("setting json.workouts="+json.workouts);
                }
        
            });
          } else if (response.status >= 400 && response.status < 600){
            console.log("/api/workouts 401 unauthorized");
          } else {
            response.json().then(json => {
              console.log(json);
              console.log('Workouts UPDATE: Somthing blew up message='+json.message);
            });
            
          }
      }).catch(err => err);
    
    }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Workouts handleSubmit() called`)
  }

  return(

    // <div className="col-lg-8">
    //     <div className="d-flex flex-column h-100 bg-light rounded-3 shadow-lg p-4">
    //       <div className="py-2 p-md-3">
    //         <div className="d-sm-flex align-items-center justify-content-between pb-4 text-center text-sm-start">
    //           <h1 className="h3 mb-2 text-nowrap">Workouts</h1>
    //         </div>
            

            <div className="container">
              <div className="row">


              {workouts.map((workout) => (
                
                <div key={workout.id} className="col">
                  <div className="card">


                    {(workout.s3_maps_key)
                        ? <img src={"https://"+process.env.REACT_APP_S3_BUCKET_NAME+".s3.amazonaws.com/"+workout.s3_maps_key} className="card-img-top" alt=""/>
                        : <img src={workoutDefaultImg} className="card-img-top" alt=""/> 
                    }

                
                    <div className="card-body">
                      <h5 className="card-title">{workout.title}</h5>
                      <p className="card-text fs-sm">{getHumanReadable(workout.workout_date)}</p>
                      <NavLink to={'/workout/'+workout.id} className="btn btn-sm btn-primary">Buy Workout NFT {workout.price_in_eth}</NavLink>
                    </div>
                  </div>
                </div>


              ))}


              </div>
            </div>

      //     </div>
      //   </div>
      // </div>
      )

};

export default Workouts
