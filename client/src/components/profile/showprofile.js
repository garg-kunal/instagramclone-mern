import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Add from "./profile";
import Navbar from "../homenavbar";
import Userpost from "../posts/userpost";

class Showprofile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: {
        image: "",
        body: "",
      },
      followers: 0,
      follows: 0,
      show: true,
    };
  }
  componentDidMount() {
    if (this.props.authStatus.user.id !== undefined)
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/user/getprofile/` +
            this.props.authStatus.user.id,
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("loginauth"),
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          this.setState({
            link: res.data.data,
            followers: res.data.data.followers.length,
            follows: res.data.data.follow.length,
          });
        })
        .catch((err) => {
          console.log(err);
        });
  }
  render() {
    if (!this.props.authStatus.isAuthenicated) {
      return <Redirect to="/login" />;
    }
    return (
      <div className="container-fluid">
        <Navbar />
        <div
          className="container"
          style={{ marginBottom: "10px", marginTop: "100px" }}
        >
          <Add />

          <div className="card mt-4">
            <div className="card-header">
              <b> {this.props.authStatus.user.name}</b>
            </div>
            <div className="card-body">
              <div className="row no-gutters">
                <div className="col-md-4 mx-auto">
                  <img
                    src={
                      this.state.link.image
                        ? `${process.env.REACT_APP_BACKEND_URL}/uploads/biopics/` +
                          this.state.link.image
                        : "https://nutristyle.com/wp-content/uploads/2020/06/bio-photo-placeholder.png"
                    }
                    height="150"
                    id="userimage"
                    width="150"
                    alt="User Pic"
                    className="img rounded-circle"
                  />
                </div>
                <div className="col-md-8">
                  <b>{this.state.link.body}</b>
                  <br />
                  <b>Followers: {this.state.followers}</b>
                  <br />
                  <b>Follows: {this.state.follows}</b>
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />

          <div style={{ fontWeight: "bold", fontSize: "20px" }}>
            Your Posts:
          </div>
          <br />
          <Userpost />
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

export default connect(mapStateToProps)(Showprofile);
