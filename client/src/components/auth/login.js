import React from "react";
import { fetcher } from "../../services/fetcher";
import Guests from "./images/guest.png";
import { connect } from "react-redux";
import "./style.css";
import { withRouter, NavLink } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "abc123@test.com",
      pwd: "12345678",
      token: "",
      message: " ",
      user: "",
    };
  }

  username(e) {
    this.setState({
      username: e.target.value,
    });
  }

  pwd(e) {
    this.setState({
      pwd: e.target.value,
    });
  }

  componentDidUpdate() {
    if (this.props.authStatus.isAuthenicated) this.props.history.push("/home");
  }

  post(e) {
    e.preventDefault();
    if (this.state.username.length === 0 || this.state.pwd.length === 0) {
      alert("Please Fill these Fields....");
      return;
    }

    if (this.state.pwd.length < 6) {
      alert("Password To Short");
      return;
    }

    const data = {
      email: this.state.username,
      password: this.state.pwd,
    };

    fetcher(`/user/login`, "POST", data).then((res) => {
      this.setState({
        token: res.data.token,
        message: res.data.message,
        user: res.data.user,
      });
      if (res.data.message === "Login Succesfully") {
        localStorage.setItem("loginauth", this.state.token);
        const add = {
          token: this.state.token,
          isAuthenicated: true,
          user: this.state.user,
        };
        this.props.auth(add);
        this.props.history.push("/home");
      }
    });
  }

  render() {
    return (
      <div className="container-fluid container-fluids">
        <div className="containgap"></div>
        <div className="container containers mx-auto">
          <div className="row no-gutters">
            <div className="overlay"></div>
            <div className="col-md-6 col-lg-6">
              <center>
                <img src={Guests} alt="user" className="img img-fluid" />
              </center>
            </div>
            <div className="col-md-6 col-lg-6 text-center">
              <h1 className="text-center">Login</h1>
              <br />
              <br />
              <form className="form-group mx-auto">
                <input
                  className="form-control mx-auto"
                  type="text"
                  required
                  placeholder="Email"
                  value={this.state.username}
                  onChange={(e) => {
                    this.username(e);
                  }}
                />
                <br />
                <input
                  type="password"
                  className="form-control mx-auto"
                  required
                  placeholder="Password"
                  value={this.state.pwd}
                  onChange={(e) => {
                    this.pwd(e);
                  }}
                />
                <br />
                <button
                  className="btn1 btn-block btn-success mx-auto"
                  type="submit"
                  onClick={(e) => {
                    this.post(e);
                  }}
                >
                  Login
                </button>
              </form>
              <div className="row mx-auto">
                <b style={{ color: "red" }} className="mx-auto">
                  {this.state.message}
                </b>
              </div>
              <div className="row mx-auto">
                <NavLink
                  to="/register"
                  style={{ color: "grey", paddingTop: "40px" }}
                  className="mx-auto"
                >
                  Create an account
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authStatus: state,
  };
};

const mapDispatchtoprops = (dispatch) => {
  return {
    auth: (token) => {
      dispatch({ type: "Login", payload: token });
    },
  };
};
export default connect(mapStateToProps, mapDispatchtoprops)(withRouter(Login));
