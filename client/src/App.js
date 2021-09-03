import React from 'react';
import axios from 'axios';
import {BrowserRouter, Route} from 'react-router-dom';
import Landing from './components/land/landing'
import Login from './components/auth/login';
import Register from './components/auth/register'
import Home from './components/home'
import {connect} from 'react-redux';
import Showprofile from './components/profile/showprofile';
import Users from './components/requests/getusers';
import Request from './components/requests/request';
class App extends React.Component {
  componentDidMount() {
    axios.get("http://localhost:5000/user/verify", {
      headers: {
        'authorization': "Bearer " + localStorage.getItem("loginauth"),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      var add = {
        token: localStorage.getItem("loginauth"),
        isAuthenicated: true,
        user: res.data
      }
      this.props.auth(add);
    }
    ).catch(err => {
      var add = {
        token: null,
        isAuthenicated:false,
        user: {}
      }
      this.props.auth(add);
    })

  }

  render() {
    return (
      <BrowserRouter>
        <Route path="/" exact component={Login}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
        <Route path="/profile" component={Showprofile}/>
        <Route path="/users" component={Users}/>
        <Route path="/request" component={Request}/>
        <Route path="/home" component={Home}/>
      </BrowserRouter>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    authStatus: state
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    auth: (add) => { dispatch({ type: 'Login', payload: add }) }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
