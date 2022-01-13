import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import { Routes, Route, Link, BrowserRouter} from "react-router-dom";

class Manufacturer extends React.Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

render() {
  if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <div className="home">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        </div>
    );
  }
}
function Home() {
  return (
    <div className="home">
            <div className="home-header">
              <h1>
                Welcome to <h1 id="decentralease"> DecentraLease</h1>
              </h1>
            </div>
            <h2 id="select">Please Select your role</h2>
            <Menubar />
        </div>
  );
}
function RegAuth() {
  const pageName = 'Regulatory Authority';
  return (
    <div className="RegAuth">
            <div><Navbar pageName = {pageName} /></div> 
            <div className="view">View Transactions</div>
            <div className="transactions"></div>
    </div>
  );
}

function Navbar(props){
  
  const pageName = props.pageName;
  return (
   <nav>
           <ul>
                <li><a href="/">Home</a></li>
                <li>{pageName}</li>
                <div className="extraline"></div>
                <div className="logo"></div>

           </ul>
           
       </nav>
  );
}

function Menubar() {
  return (
   <nav className="menubar">
            <div className="links">
                <a href="/RegAuth"><div className = "link">
                    <h3>Regulatory Authority</h3>
                    <div className="imageBox1"> </div>
                </div></a>

                <a href="/Manufacturer">< div className = "link">
                    <h3>Manufacturer</h3>
                    <div className="imageBox2"> </div>
                </div></a>
                <a href="/Dealer"><div className = "link">
                    <h3>Dealer</h3>
                    <div className="imageBox3"></div> 
                </div></a>
                <a href="/Buyer"><div className = "link">
                    <h3>Buyer</h3>
                   <div className="imageBox4"></div> 
                </div></a>
            </div>
        </nav>
  );
}
class App extends Component {
  

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/RegAuth" element={<RegAuth />} />
            <Route path="/manufacturer" element={<Manufacturer />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
