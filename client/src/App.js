import React, { useState, useEffect, Component } from "react";
import CarContract from "./contracts/Car.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormspreeProvider } from "@formspree/react";

class Manufacturer extends Component {
  state = {
    arrayvar: [],
    web3: null,
    accounts: null,
    contract: null,
    modalShow: false,
    setModalShow: false,
    data: null
  };

  handleCallback = async childData => {
    //this.setState({ data: childData[0].toValue() });

    const { accounts, contract } = this.state;
    console.log("Contract: ", contract);

    await contract.methods.addCar(childData[0], childData[1], childData[2], childData[3]).send({ from: accounts[0] });
    const response = await contract.methods.getCar(childData[0]).call();
    console.log(response);
    this.setState({
      arrayvar: [...this.state.arrayvar, response]
    });
    console.log(this.state.arrayvar);
    //const { 0: var1, 1: var2, 2: var3, 3: var4 } = await contract.methods.getCars();

    //const response1 = await contract.methods.getCounter();

    //console.log(var1, var2, var3, var4);

    /*contract.methods.getCars().then(function(res) {
      var a0 = res[0];
      var a1 = res[1];
      var a2 = res[2];
      var a3 = res[3];
    });*/
    //console.log("A0: ", a0);
    //console.log(contract.methods.getCounter().call());
    //this.setState({ storageValue: response });
    //console.log("Response: ", response);
    // console.log("StorageValue: ", this.state.storageValue);
    //console.log("It's me YES IT IS", this.state.data);
    console.log("It's me YES IT IS", childData[0]);
    this.setState({ modalShow: false });
  };

  componentDidMount = async () => {
    try {
      const _this = this;
      this.handleCallback = this.handleCallback.bind(_this);
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CarContract.networks[networkId];
      const instance = new web3.eth.Contract(CarContract.abi, deployedNetwork && deployedNetwork.address);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      console.log("hello!");
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };
  runExample = async () => {
    console.log("RunExample is running!");
    const { contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getCar("");
    console.log(response);

    // Update state with the result.
    this.setState({ storageValue: response.toString() });
  };

  createTable = () => {
    let table = [];

    // Outer loop to create parent
    for (let i = 0; i < this.state.arrayvar.length; i++) {
      let children = [];
      children.push(<td>{i}</td>);
      //Inner loop to create children
      for (let j = 0; j < 4; j++) {
        children.push(<td>{this.state.arrayvar[i][j]}</td>);
        //children.push(<td>{`Column ${j + 1}`}</td>)
      }
      //Create the parent and add the children
      table.push(<tr>{children}</tr>);
    }
    return table;
  };
  render() {
    const { data } = this.state;
    const pageName = "Manufacturer";
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="RegAuth">
        <div>
          <Navbar pageName={pageName} />
        </div>
        <div className="lowerNavItems">
          <div className="view"> Current </div> <div className="viewInactive"> Sold </div>
          <div className="viewInactive">
            <Button id="addCarButton" onClick={() => this.setState({ modalShow: true })}>
              Add Car
            </Button>
          </div>
        </div>
        <MyVerticallyCenteredModal
          parentCallback={this.handleCallback}
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
          const
        />
        <div className="transactions">
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th> # </th> <th> Vin </th>
                <th> Year </th>
                <th> Make </th>
                <th> Model </th>
              </tr>
            </thead>
            <tbody>{this.createTable()}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

class MyVerticallyCenteredModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 0
    };
  }

  handleCallback = childData => {
    this.props.parentCallback(childData);
    // this.setState({ data: childData });
    //console.log(childData);
  };
  render() {
    return (
      <Modal {...this.props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Add Car </Modal.Title>{" "}
        </Modal.Header>
        <Modal.Body>
          <AddForm parentCallback={this.handleCallback} />
        </Modal.Body>
      </Modal>
    );
  }
}
class AddForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.vin = React.createRef();
    this.year = React.createRef();
    this.make = React.createRef();
    this.model = React.createRef();
  }

  handleSubmit(event) {
    const form_data = [this.vin.current.value, this.year.current.value, this.make.current.value, this.model.current.value];
    //console.log(form_data);
    //alert("A name was submitted: " + this.vin.current.value);
    this.props.parentCallback(form_data);
    event.preventDefault();
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group className="mb-2" controlId="formVinNumber">
          <Form.Label> Vin Number </Form.Label>
          <Form.Control type="text" placeholder="Enter Vin Number" ref={this.vin} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="formYear">
          <Form.Label> Year </Form.Label>
          <Form.Control type="text" placeholder="Enter year Vehicle was manufactured" ref={this.year} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="formMake">
          <Form.Label> Make </Form.Label>
          <Form.Control type="text" placeholder="Enter Make" ref={this.make} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="formModel">
          <Form.Label> Model </Form.Label>
          <Form.Control type="text" placeholder="Enter Model" ref={this.model} />
        </Form.Group>
        <Button className="mb-2" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

function Home() {
  return (
    <div className="home">
      <div className="home-header">
        <h1>
          Welcome to <h1 id="decentralease"> DecentraLease </h1>{" "}
        </h1>
      </div>
      <h2 id="select"> Please Select your role </h2>
      <Menubar />
    </div>
  );
}

function RegAuth() {
  const pageName = "Regulatory Authority";
  return (
    <div className="RegAuth">
      <div>
        {" "}
        <Navbar pageName={pageName} />
      </div>
      <div className="view"> View Transactions </div>
      <div className="transactions"></div>
    </div>
  );
}

function Navbar(props) {
  const pageName = props.pageName;
  return (
    <nav>
      <ul>
        <li>
          {" "}
          <a href="/"> Home </a>
        </li>
        <li> {pageName} </li>
        <div className="extraline"></div> <div className="logo"></div>
      </ul>
    </nav>
  );
}

function Menubar() {
  return (
    <nav className="menubar">
      <div className="links">
        <a href="/RegAuth">
          <div className="link">
            <h3> Regulatory Authority </h3>
            <div className="imageBox1"> </div>
          </div>
        </a>

        <a href="/Manufacturer">
          <div className="link">
            <h3> Manufacturer </h3>
            <div className="imageBox2"> </div>
          </div>
        </a>
        <a href="/Dealer">
          <div className="link">
            <h3> Dealer </h3>
            <div className="imageBox3"></div>
          </div>
        </a>
        <a href="/Buyer">
          <div className="link">
            <h3> Buyer </h3>
            <div className="imageBox4"></div>
          </div>
        </a>
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
