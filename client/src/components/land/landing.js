import React from 'react';
import {connect} from 'react-redux';
import { NavLink,Redirect} from 'react-router-dom';
import Slider from '../carusel';
import './land.css';
function Landing(props) {
    if (props.authStatus.isAuthenicated)
            return <Redirect to="/home" />

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink className="navbar-brand" to="/">Instabar</NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/">Home <span className="sr-only">(current)</span></NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/login">Login</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/register">Register</NavLink>
                        </li>

                    </ul>
                </div>
            </nav>
            <div className="contains"> <Slider /></div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      authStatus: state
    }
  }

export default connect(mapStateToProps)(Landing);
