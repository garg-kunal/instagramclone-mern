import React from 'react';
import {NavLink} from 'react-router-dom';
import Logout from './auth/logout';
const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-primary" style={{paddingBottom:"20px"}}> 
            <NavLink className="navbar-brand" to="/home">Instabar</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav mx-auto">
                    <li className="nav-item active">
                        <NavLink className="nav-link" to="/home">Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/profile">Profile</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/users">Users</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/request">Requets</NavLink>
                    </li>
                    <li className="nav-item">
                        <Logout/>
                    </li>

                </ul>
            </div>
        </nav>
    )
}
export default Navbar;