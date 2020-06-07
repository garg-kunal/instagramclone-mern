import React from 'react';
import {NavLink,Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import Logout from '../components/auth/logout';
import Bio from './profile/profile';
import Showprofile from './profile/showprofile';
import Create from './posts/createpost';
import Posts from './posts/getallposts';
import Navbar from './homenavbar';
class Home extends React.Component {
   
    componentDidMount() {
        if (!this.props.authStatus.isAuthenicated)
            this.props.history.push("/login");

    }
    render() {
        if (!this.props.authStatus.isAuthenicated){
            return <Redirect to='/login'/>
        }
        return (
            <div className="container-fluid">
                <Navbar/>
              <Create/>
              <Posts/>
            </div>
        )
    }

}
const mapStateToProps = (state) => {
    return {
        authStatus: state
    }
}

export default connect(mapStateToProps)(Home);