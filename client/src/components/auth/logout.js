import React from 'react';
import { Redirect } from 'react-router-dom';
import {connect} from 'react-redux';

 class Logout extends React.Component {

    constructor() {
        super();
        this.state = {
            loggedIn: false
        }


    }
    logout() {
        localStorage.removeItem("loginauth");
        this.setState({
            loggedIn: true
        })
        const add={
            token:null,
            isAuthenicated:false,
            user:{}
        }
        this.props.auth(add)
    }



    render() {
        if (this.state.loggedIn) {
            return <Redirect to="/login" />
        }
        return (
            <div>
                <button className="btn btn1 btn-primary" onClick={() => { this.logout() }}>Logout</button>
            </div>
        )
    }
}

const mapDispatchToProps=(dispatch)=>{
    return{
        auth: (add) => { dispatch({ type: 'Login', payload: add }) }
    }
}

export default connect(null,mapDispatchToProps)(Logout);