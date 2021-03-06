import React, { Component } from 'react';
import MessageBox from './components/MessageBox'
import UsersBox from './components/UsersBox';
import InputBox from './components/InputBox';
import LoginScreen from './components/LoginScreen';
import './App.css';


const UPDATE_RATE = 2000;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages : [],
      users: [],
      currentUser: ''
    };

    this.setCurrentUser = this.setCurrentUser.bind(this);
  }

  lastUpdate = 0;

  setCurrentUser(username) {
    this.setState({ currentUser: username });
  }

  checkServer = (timestamp) => {
    if (this.lastUpdate + UPDATE_RATE < timestamp) {
      this.fetches();
      this.lastUpdate = timestamp;
    }
    window.requestAnimationFrame(this.checkServer);
  }

  fetches = () => {
    fetch('http://0.0.0.0:3500/users').then((res) => {
      res.json().then( (users) => {
        this.setState({users: users});
      });
    }).catch( (err) => {
      console.log(err);
    });
    fetch(`http://0.0.0.0:3500/chatlog?username=${this.state.currentUser}`).then((res) => {
      res.json().then( (messages) => {
        this.setState({messages: messages});
      });
    }).catch( (err) => {
      console.log(err);
    });
  }

  componentDidMount() {
    this.fetches();
    window.requestAnimationFrame(this.checkServer);
  }

  render() {
    if(this.state.currentUser) {
      return (
        <div className="container">
          <div className="header">
            <h1 className="header-text">REACT CHAT BOX</h1>
          </div>

          <div className="chat-log-container">
            <MessageBox
              className="chat-log-box"
              messages={this.state.messages} />
          </div>

          <div className="users-container">
            <UsersBox
              className="users-box"
              users={this.state.users} />
          </div>

          <div className="input-container">
            <InputBox currentUser={this.state.currentUser}/>
          </div>

        </div>
      );
    } else {
      return (
          <LoginScreen setUser={this.setCurrentUser}/>
      );
    }
  }
}

export default App;
