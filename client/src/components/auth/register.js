import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import Guest from './images/edit.png'
import { Redirect, withRouter,NavLink } from 'react-router-dom';
class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            pwd: "",
            name: "",
            loggedIn: false,
            message: ""
        }



    }
    username(e) {

        this.setState({
            username: e.target.value
        })
    }
    name(e) {

        this.setState({
            name: e.target.value
        })
    }
    componentDidMount() {
        if (this.props.authStatus.isAuthenicated)
            this.props.history.push("/home");

    }

    pwd(e) {
        this.setState({
            pwd: e.target.value
        }
        )
    }
    post(e) {
        e.preventDefault();
        if (this.state.username.length === 0 || this.state.pwd.length === 0 || this.state.name.length === 0) {
            alert("Please Fill these Fields....")
        }
        else if (this.state.pwd.length < 6) alert("Password To Short");
        else {
            const exercise = {
                email: this.state.username,
                password: this.state.pwd,
                name: this.state.name
            }
            Axios.post('http://localhost:5000/user/register', exercise).then(res => {
                this.setState({
                    message: res.data.message
                })
                if (res.data.message === "Registered") {
                    this.setState({
                        loggedIn: true,

                    })

                }

            }
            )
        }

    }


    render() {
        if (this.state.loggedIn === true)
            return <Redirect to="/login" />
        return (
            <div className="container-fluid container-fluids">
                <div className="containgap">

                </div>
                <div className="container containers">
                    <div className="row no-gutters">
                        {/* <div className="overlay"></div> */}
                        <div className="col-md-6">
                            <center><img src={Guest} alt="user" className="img img-fluid" /></center>
                        </div>
                        <div className="col-md-6">
                            <h1 className="text-center"><b>Register</b></h1><br /><br />

                            <form className="form-group">
                                <input
                                    type="text"
                                    className="form-control mx-auto"
                                    required placeholder="Email"
                                    value={this.state.username}
                                    onChange={(e) => { this.username(e) }}
                                /><br />
                                <input
                                    type="text"
                                    value={this.state.name}
                                    className="form-control mx-auto"
                                    required placeholder="Your Name"
                                    onChange={(e) => { this.name(e) }}
                                /><br />
                                <input
                                    type="password"
                                    value={this.state.pwd}
                                    className="form-control mx-auto"
                                    required placeholder="Password"
                                    onChange={(e) => { this.pwd(e) }}
                                /><br />
                                <button className="btn btn1 btn-block btn-primary mx-auto" type="submit" onClick={(e) => { this.post(e) }}>Register</button>
                            </form>
                            <div className="row mx-auto">
                                <b style={{ color: "red" }} className="mx-auto">{this.state.message}</b>
                            </div>
                            <div className="row mx-auto">
                                <NavLink to="/login" style={{ color: "grey", paddingTop: "40px" }} className="mx-auto">Already have an Account ? <b>Login</b></NavLink>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        authStatus: state
    }
}
export default connect(mapStateToProps)(withRouter(Register));