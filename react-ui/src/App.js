import { useCallback, useContext, useEffect } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
//import getWeb3 from "./getWeb3";
import "./App.css";
import Home from "./components/Home/Home";
import AccountProfile from "./components/AccountProfile/AccountProfile";
import ScrollUp from "./components/ScrollUp";
import NotFound from "./components/NotFound";
import Login from "./components/Login/Login";
import ConnectStrava from "./components/Strava/ConnectStrava";
import StravaCallback from "./components/Strava/StravaCallback";
import Logout from "./components/Logout/Logout";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import ChangePassword from "./components/AccountProfile/ChangePassword";
import StravaConnection from "./components/AccountProfile/StravaConnection";
import Signup from "./components/Signup/Signup";
import { UserContext } from "./components/UserContext"
import RequireAuth from "./RequireAuth";
import ProfileInfo from "./components/AccountProfile/ProfileInfo";

function App() {
  //state = { storageValue: 0, web3: null, accounts: null, contract: null };
  const [userContext, setUserContext] = useContext(UserContext)
  //console.log("APP BEFORE userContext="+JSON.stringify(userContext));


  //Timer to check refreshToken in the background and on page load
  const verifyUser = useCallback(() => {

 

    //console.log("APP VERIFYUSER REFRESH TOKEN userContext="+JSON.stringify(userContext));
    //console.log("APP VERIFYUSER REFRESH TOKEN userContext.token="+userContext.token);

    
    //REFRESH THE TOKEN
    fetch(process.env.REACT_APP_NODE_URI + "/api/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${userContext.token}`, 
      },
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        console.log("response.OK so saving token in UserContext data.token="+data.token);
        setUserContext(oldValues => {
          return { ...oldValues, user: data.user, token: data.token }
        })
        
        
      } else {
        console.log("response NOT ok so setting token null in UserContext");
        console.log(this);
        setUserContext(oldValues => {
           return { ...oldValues, user: null, token: null }
        })
      }
      //Call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(verifyUser, 5 * 60 * 1000) //5 minutes
      //setTimeout(verifyUser, 30 * 1000) //30 seconds
    })
  }, []) 


  //Hook to load verifyUser at page load time
  useEffect( () => {
    console.log("USE EFFECT IS LIGHTING UP VERIFYUSER()");
    verifyUser()
  //}, [verifyUser]);
  }, []);
  
  // componentDidMount = async () => {
  //   console.log("setInterval() on this.props.getToken");
  //   setTimeout(() => {
  //     this.getToken();
  //     setTimeout(() => {
  //       this.getToken();
  //     }, 3000);  
  //   }, 3000);
    // try {
    //   // Get network provider and web3 instance.
    //   const web3 = await getWeb3();

    //   // Use web3 to get the user's accounts.
    //   const accounts = await web3.eth.getAccounts();

    //   // Get the contract instance.
    //   const networkId = await web3.eth.net.getId();
    //   const deployedNetwork = SimpleStorageContract.networks[networkId];
    //   const instance = new web3.eth.Contract(
    //     SimpleStorageContract.abi,
    //     deployedNetwork && deployedNetwork.address,
    //   );

    //   // Set web3, accounts, and contract to the state, and then proceed with an
    //   // example of interacting with the contract's methods.
    //   this.setState({ web3, accounts, contract: instance }, this.runExample);
    // } catch (error) {
    //   // Catch any errors for any of the above operations.
    //   alert(
    //     `Failed to load web3, accounts, or contract. Check console for details.`,
    //   );
    //   console.error(error);
    // }
  //};

  //runExample = async () => {
    // const { accounts, contract } = this.state;

    // // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // // Update state with the result.
    // this.setState({ storageValue: response });
  //};

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetPasswordKeyParam" element={<ResetPassword />} />
          <Route path="/connect-strava" element={<ConnectStrava />} />
          <Route path="/strava-callback" element={<StravaCallback />} />
          {/* <Route path="/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} /> */}
          <Route path="/account" element={<RequireAuth><AccountProfile /></RequireAuth>}>
              <Route index element={<ProfileInfo />} />
              <Route path="info" element={<ProfileInfo />} />
              <Route path="changepassword" element={<ChangePassword />} />
              <Route path="stravaconnection" element={<StravaConnection />} />
          </Route>
          {/* <Route path="/account-strava-connection" element={<RequireAuth><StravaConnection /></RequireAuth>} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollUp/>
      </BrowserRouter>
    );
}

export default App;
