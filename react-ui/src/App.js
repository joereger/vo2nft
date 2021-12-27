import React, { Component } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import Home from "./components/Home/Home";
import AccountProfile from "./components/Account Profile/AccountProfile";
import ScrollUp from "./components/ScrollUp";
import NotFound from "./components/NotFound";
import Signin from "./components/Signin/Signin";
import Signup from "./components/Signup/Signup";


class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
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
  };

  runExample = async () => {
    // const { accounts, contract } = this.state;

    // // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // // Update state with the result.
    // this.setState({ storageValue: response });
  };

  render() {
    // if (!this.state.web3) {
    //   return  (
    //     <div className="page-loading active">
    //       <div className="page-loading-inner">
    //         <div className="page-spinner"></div><span>Loading...</span>
    //       </div>
    //     </div>
    //   );
    // }
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/account-profile" element={<AccountProfile />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollUp/>
      </BrowserRouter>
    );
  }
}

export default App;
