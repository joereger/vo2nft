import React, { useContext } from "react"
import { Link, NavLink, useParams } from 'react-router-dom';
import main from '../../img/avatar.png';
import { UserContext } from "../UserContext"
import axios from "axios";
import { useQuery } from 'react-query'

const ProfileSideBar = () => {

  const [userContext, setUserContext] = useContext(UserContext)
  const { username } = useParams();

  const { data: user, isLoading, error } = useQuery(["profile", username], () =>
    axios.get( process.env.REACT_APP_NODE_URI + '/api/profile/'+username,
      { withCredentials: true, headers: { Authorization: `Bearer ${userContext.token}` } }
    ).then((res) => res.data.user)
  ); 

  console.log("user: "+JSON.stringify(user));

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return(

    <div className="col-lg-4 mb-4 mb-lg-0">
      <div className="bg-light rounded-3 shadow-lg">
        <div className="px-4 py-4 mb-1 text-center">
          <Link to={'/u/'+(user && user.username)}>
              {(user && user.profile_pic) 
                ? <img className="d-block rounded-circle mx-auto my-2" src={user.profile_pic} alt="" width="110" />
                : <img className="d-block rounded-circle mx-auto my-2" src={main} alt="" width="110" />
              }
              <h6 className="mb-0 pt-1">{user.name}</h6>
              <span className="text-muted fs-sm">@{user && user.username}</span>
            </Link>
        </div>
        <div className="d-lg-none px-4 pb-4 text-center">
          <a className="btn btn-primary px-5 mb-2" href="#account-menu" data-bs-toggle="collapse">
            <i className="ai-menu me-2"></i>Account menu
          </a>
        </div>
        <div className="d-lg-block collapse pb-2" id="account-menu">
          <h3 className="d-block bg-secondary fs-sm fw-semibold text-muted mb-0 px-4 py-3">Profile</h3>
            <NavLink className="d-flex align-items-center nav-link-style px-4 py-3" to="/account/workouts"><i className="ai-shopping-bag fs-lg opacity-60 me-2"></i>Workouts{/* <span className="nav-indicator"></span> */}</NavLink>
            {/* <a className="d-flex align-items-center nav-link-style px-4 py-3 border-top" href="dashboard-sales.html"><i className="ai-dollar-sign fs-lg opacity-60 me-2"></i>NFTs Sold<span className="text-muted fs-sm fw-normal ms-auto">$735.00</span></a> */}
        </div>
      </div>
    </div>
  );

}

export default ProfileSideBar
