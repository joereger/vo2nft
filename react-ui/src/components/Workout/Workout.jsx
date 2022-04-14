import React, { useContext, useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom';
import workoutDefaultImg from '../../img/workout-default.png';
import { UserContext } from "../UserContext"
import { DateTime, Duration } from "luxon";
import axios from "axios";
import { useQuery } from 'react-query'
import AccountNavbar from "../AccountNavbar";
import { ethPriceInUSD } from "../Util/util.js";
import EditableLabel from 'react-inline-editing';

const getHumanReadable = (inDate) => {
  if (inDate){
    return DateTime.fromISO(inDate).toRelative()
  }
}

const Workout = () => {

  const [userContext, setUserContext] = useContext(UserContext);
  const { workout_id_param } = useParams();
  const [currentEthPriceInUSD, setCurrentEthPriceInUSD] = useState("");
  //console.log("at top currentEthPriceInUSD="+currentEthPriceInUSD);

  const { isLoading, error, data: workout_data, refetch } = useQuery(["workout", workout_id_param], () =>
    axios.get( process.env.REACT_APP_NODE_URI + '/api/workout/'+workout_id_param,
      { withCredentials: true, headers: { Authorization: `Bearer ${userContext.token}` } }
    ).then((res) => res.data)
  );

  //console.dir(workout_data);

  const userid_creator = workout_data?.workout?.userid_creator;
  const userid_currentowner = workout_data?.workout?.userid_creator;

  //console.log("userid_creator: "+userid_creator);

  const { data: creator_data } = useQuery(["user", userid_creator], () =>
    axios.get( process.env.REACT_APP_NODE_URI + '/api/user/'+userid_creator,
      { enabled: !!userid_creator, withCredentials: true, headers: { Authorization: `Bearer ${userContext.token}` } }
    ).then((res) => res.data)
  );

  //console.dir(creator_data);

  const { data: currentowner_data } = useQuery(["user", userid_currentowner], () =>
    axios.get( process.env.REACT_APP_NODE_URI + '/api/user/'+userid_currentowner,
      { enabled: !!userid_currentowner, withCredentials: true, headers: { Authorization: `Bearer ${userContext.token}` } }
    ).then((res) => res.data)
  );

  const { data: me } = useQuery(["me", 1], () =>
    axios.get( process.env.REACT_APP_NODE_URI + '/api/me',
      { withCredentials: true, headers: { Authorization: `Bearer ${userContext.token}` } }
    ).then((res) => res.data)
  );

  useEffect(() => {
    
    (async function() {
        try {
          setCurrentEthPriceInUSD( await ethPriceInUSD() );
          console.log("in useEffect() currentEthPriceInUSD="+currentEthPriceInUSD);    
        } catch (e) {
            console.error(e);
        }
    })();

  }, [])

  const _handleFocus = (text) => {
    console.log('Focused with text: ' + text);
  }

  const _handleFocusOut = async (text) => {
    console.log('Left editor with text: ' + text);

    const response = await axios.patch( process.env.REACT_APP_NODE_URI + '/api/workout/'+workout_id_param,
      { price_in_eth: text},
      { withCredentials: true, headers: { Authorization: `Bearer ${userContext.token}` } }
    )

    //Refetch the workout data
    refetch();

    //Update the $$$

  }


  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return(

    
    <>
      <AccountNavbar />

      <div className="container position-relative zindex-5 pb-4 mb-md-3" style={{marginTop: '-350px'}}>
        <div className="row">

          <div class="d-flex p-2">

           
            <div class="col-lg-5 p-1">
              <div class="d-flex flex-column h-100 bg-light rounded-3 shadow-lg p-4">
                <div class="py-2 p-md-3">
                  <div class="d-sm-flex align-items-center justify-content-between pb-4 text-center text-sm-start">
                    {(workout_data.workout.s3_maps_key)
                        ? <img src={"https://"+process.env.REACT_APP_S3_BUCKET_NAME+".s3.amazonaws.com/"+workout_data.workout.s3_maps_key} className="card-img-top" alt=""/>
                        : <img src={workoutDefaultImg} className="card-img-top" alt=""/> 
                    }
                  </div>
                  
                  

                </div>
              </div>
            </div>



            <div class="col-lg-7 p-1">
              <div class="d-flex flex-column h-100 bg-light rounded-3 shadow-lg p-4">
                <div class="py-2 p-md-3">
                  {/* <div class="d-sm-flex align-items-center justify-content-between pb-4 text-center text-sm-start"> */}
                   
                    {/* Start big three workout stats */}
                    <div class="container mt-3 mb-3">
                      <div class="row">
                        <div class="col justify-content-center">
                          <center>
                            <h1>{workout_data.workout?.strava_details?.type}</h1>
                            <span class="badge bg-secondary">Type</span>
                          </center>
                        </div>
                        <div class="col justify-content-center">
                          <center>
                            <h1>{(workout_data.workout?.strava_details?.distance * 0.000621371192).toFixed(2)} mi</h1>
                            <span class="badge bg-secondary">Distance</span>
                          </center>
                        </div>
                        <div class="col justify-content-center">
                          <center>
                            <h1>{Duration.fromObject({seconds:workout_data.workout?.strava_details?.moving_time}).toFormat('hh:mm:ss')}</h1>
                            <span class="badge bg-secondary">Time</span>
                          </center>
                        </div>
                      </div>
                    </div>
                    {/* End big three workout stats */}
                   
                    <h1 class="h3 mb-2 text-nowrap">{workout_data.workout.title}</h1>
                    <p className="card-text fs-sm">{getHumanReadable(workout_data.workout.workout_date)}</p>
                    

                    {/* Start Buy Area */}

                    <div class="container mt-3">
                      <div class="row">
                        <div class="col justify-content-center">
                          <button type="button" class="btn btn-primary">Buy This Workout NFT</button>
                        </div>
                        <div class="col justify-content-center">
                        {(workout_data?.workout?.userid_currentowner === me?.id)
                            ? <center><h4><EditableLabel text={(workout_data.workout.price_in_eth).toFixed(6)}
                            labelClassName='myLabelClass'
                            inputClassName='myInputClass'
                            inputWidth='200px'
                            inputHeight='25px'
                            inputMaxLength='50'
                            labelFontWeight='bold'
                            inputFontWeight='bold'
                            onFocus={_handleFocus}
                            onFocusOut={_handleFocusOut}
                        /> ETH</h4></center>
                            : <center><h4>{(workout_data.workout.price_in_eth).toFixed(6)} ETH</h4></center> 
                        }


                        
                        
                        <center><h4>${(workout_data.workout.price_in_eth * currentEthPriceInUSD).toFixed(2)}</h4></center>
                        </div>
                        <div class="col justify-content-center">
                          <div>Creator: <Link to={'/u/'+(creator_data?.user.username)}>{creator_data?.user.username}</Link></div>
                          <div>Current Owner: <Link to={'/u/'+(currentowner_data?.user.username)}>{currentowner_data?.user.username}</Link></div>
                        </div>
                      </div>
                    </div>

                    {/* End Buy Area */}

                    

                    {(workout_data.workout.description)
                        ? <div>workout_data.workout.description</div>
                        : <></>  
                    }

                  {/* </div> */}
                  
                  <div class="row"></div>

                </div>
              </div>
            </div>


              


          </div>    

        </div>
      </div>
    </>
    
              
      )

};

export default Workout
