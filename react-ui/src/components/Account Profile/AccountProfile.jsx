import { useEffect, useContext } from "react";
import AccountNavbar from "../AccountNavbar";
import ProfileInfo from "./Profile Info/ProfileInfo";
import SideBar from "./SideBar";
import { UserContext } from "../UserContext"

const AccountProfile = () => {
  useEffect(() => document.getElementById('root').style.background = '#f7f7fc')
  const [userContext] = useContext(UserContext)
  console.log("ACCOUNT PROFILE userContext="+JSON.stringify(userContext));

  return (
    <>
      <AccountNavbar />
      
      <div class="container position-relative zindex-5 pb-4 mb-md-3" style={{marginTop: '-350px'}}>
        <div class="row">
          <SideBar />
          <ProfileInfo />
        </div>
      </div>
    </>
  )
}

export default AccountProfile;
