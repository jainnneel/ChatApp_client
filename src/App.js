import React, { Component } from 'react'
import Login from './components/login/login'
import ChatWindow from "./components/chatWindow/chatWindow";
import { createSignalProtocolManager, SignalServerStore } from "./signal/SignalGateway"
import Register from './components/Register/Register'
import Otpverify from './components/Register/Otpverify'
import Groupjoin from './components/chat/Groupjoin'
import Endtoendchatwindow from './components/Endtoend/Endtoendchatwindow'
import RegisterE2ee from './components/E2ee/Register'
import {messaging} from './components/web-push/init-fcm'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import './App.css';
import Chat from './components/chat/Chat';

export default class ChatApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      loggedInUserObj: {},
      dummySignalServer: new SignalServerStore(),
      signalProtocolManagerUser: undefined
    }
    this.setLoggedinUser = this.setLoggedinUser.bind(this)
  }

  setLoggedinUser(loggedInUserObj) {
    this.setState({ isLoggedIn: true, loggedInUserObj: { ...loggedInUserObj } }, () => {
      // Initializing signal server here
      // createSignalProtocolManager(loggedInUserObj._id, loggedInUserObj.name, this.state.dummySignalServer)
      //   .then(signalProtocolManagerUser => {
      //     this.setState({ signalProtocolManagerUser: signalProtocolManagerUser })
      //   })
    })
  }
  
  async componentDidMount() {
    
  
  }

  render() {
    
    return (
      <Router>
        <Switch>

           <Route path="/"  component={Chat} exact/>
           <Route path="/register" component={Register} exact/>
           {/* <Route path="/RegisterE2ee" component={RegisterE2ee} exact/> */}
           <Route path="/login" component={Login}  exact/>
           <Route path="/verify" component={Otpverify} exact/>
           <Route path="/group/:id" component={Groupjoin} exact/>
           {/* <Route path="/e2ee/chatwindow" component={Endtoendchatwindow} exact/> */}
        </Switch>
      {/* <div className="App"> */}
        {/* { !this.state.isLoggedIn && <Login setLoggedinUser={this.setLoggedinUser} />} */}

        {/* { this.state.isLoggedIn && <ChatWindow
          loggedInUserObj={this.state.loggedInUserObj}
          signalProtocolManagerUser={this.state.signalProtocolManagerUser}
        />} */}
        
      {/* </div> */}
      </Router>
    )
      
   
  }
}
