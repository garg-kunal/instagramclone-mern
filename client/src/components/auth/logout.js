import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class Logout extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
    };
  }

  logout() {
    localStorage.removeItem("loginauth");
    this.setState({
      loggedIn: true,
    });
    const add = {
      token: null,
      isAuthenicated: false,
      user: {},
    };
    this.props.auth(add);
    this.props.history.push("/login");
  }

  render() {
    return (
      <div>
        <button
          className="btn btn1 btn-primary"
          onClick={() => {
            this.logout();
          }}
        >
          Logout
        </button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    auth: (add) => {
      dispatch({ type: "Login", payload: add });
    },
  };
};

export default connect(null, mapDispatchToProps)(withRouter(Logout));
