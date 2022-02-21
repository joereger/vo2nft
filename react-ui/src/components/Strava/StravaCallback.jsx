import React, { useContext, useState, useEffect } from "react"
import AccountNavbar from "../AccountNavbar";
import { UserContext } from "../UserContext"
import { useNavigate, useSearchParams } from "react-router-dom"

const StravaCallback = () => {

  console.log("StravaCallback called");

  const [isAlertOn, setIsAlertOn] = useState(false);
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();

  const [userContext, setUserContext] = useContext(UserContext)

  const [searchParams, setSearchParams] = useSearchParams();
 

  useEffect(() => {

    console.log("StravaCallback useEffect() called");

    const error = searchParams.get('error')
    const code = searchParams.get('code')
    const scope = searchParams.get('scope')
    const state = searchParams.get('state')


    //Check for auth error
    if (error && error === "access_denied" ){
      console.log("StravaCallback - error found so auth appears invalid - error="+error);
    } else {
      console.log("StravaCallback - no error found so auth appears valid - error="+error);

      //Check scope to make sure we have enough permissions
      if (scope && (scope.search("activity:read")<0 || scope.search("read")<0) ){
        console.log("StravaCallback - scope doesn't have enough permissions - scope="+scope);
      } else {
        console.log("StravaCallback - scope has enough permissions - scope="+scope);

        //Grab the code 
        if ( !code || code==null || code.length===0 ){
          console.log("StravaCallback - code appears invalid - code="+code);
        } else {
          console.log("StravaCallback - code appears valid - code="+code);

          //Get the user.id if user is logged in
          var user_id = null;
          if (userContext?.user?.id && userContext?.user?.id>0){
            user_id = userContext?.user?.id;
          }

          //Call Node backend to exchange the code for an access token and some athlete data
          return fetch(process.env.REACT_APP_NODE_URI + '/api/strava_convert_code_to_access_token', {
              method: 'POST',
              credentials: "include",
              body: JSON.stringify({ code: code, user_id: user_id }),
              headers: {
                  'Content-Type': 'application/json'
              }
          }).then(response => {
              if (response.status >= 200 && response.status < 300) {
                console.log("/API/STRAVA_CONVERT_CODE_TO_ACCESS_TOKEN: received a SUCCESSFUL");
                response.json().then(json => {
                  console.log(json);

                  //Save the user in the UserContext
                  if (json.user!=null){
                    setUserContext(oldValues => {
                      return { ...oldValues, strava_code: code, user: json.user, strava_data: json.strava_data, stravaAccount: json.stravaAccount }
                    })
                  } else {
                    setUserContext(oldValues => {
                      return { ...oldValues, strava_code: code, strava_data: json.strava_data, stravaAccount: json.stravaAccount }
                    }) 
                  }
                  
                  //console.log("/API/STRAVA_CONVERT_CODE_TO_ACCESS_TOKEN: token set token="+json.token);
                  //console.log("/API/STRAVA_CONVERT_CODE_TO_ACCESS_TOKEN: AFTER LOGIN/ABOUT TO REDIRECT userContext="+JSON.stringify(userContext));
                  
                  setIsAlertOn(false);

                  //Redirect user
                  //navigate("/account");
                });
              } else if (response.status >= 400 && response.status < 600){
                console.log("/API/STRAVA_CONVERT_CODE_TO_ACCESS_TOKEN: /api/login 401 unauthorized");
                setAlertText("Sorry, something went wrong converting your Strava code to an access token.  Nothing has been changed in your Strava account.  Please try again.");
                setIsAlertOn(true);
              } else {
                response.json().then(json => {
                  console.log(json);
                  console.log('/API/STRAVA_CONVERT_CODE_TO_ACCESS_TOKEN:: Somthing blew up message='+json.message);
                  setAlertText(json.message);
                  setIsAlertOn(true);
                });
                
              }
          }).catch(err => err);


        }
      }

    }

    

  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();



    navigate("/account");
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

                        <h1 className="h2">Ok, Strava was connected</h1>
                        <p className="fs-ms text-muted mb-4">We only look at public workouts and public profile info.  We don't post to your Strava account.</p>
                        <form onSubmit={e => {handleSubmit(e)}} className="needs-validation" noValidate>
                   
                          
                          <button className="btn btn-primary d-block w-100" type="submit">Continue</button>
                          
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

export default StravaCallback;
