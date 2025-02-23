import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import Navbar from "../homenavbar";
import { withRouter } from "react-router-dom";
class Request extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: [
        {
          image: " ",
          from: " ",
          name: "No Request",
        },
      ],
    };
  }
  accept(from) {
    const data = {
      me: this.props.authStatus.user.id,
      followId: from,
    };
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/user/follow`, data, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("loginauth"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        alert(res.data.message);
        this.props.history.push("/profile");
      })
      .catch((err) => console.log(err));
  }
  componentDidMount() {
    console.log("request");
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/user/getrequest/` +
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
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div className="container-fluid">
        <Navbar />
        <div
          className="container"
          style={{ marginBottom: "20px", marginTop: "80px" }}
        >
          {this.state.link.length === 0 ? (
            <center style={{ fontWeight: "bold" }}>No Requests</center>
          ) : (
            this.state.link.map((item, key) => (
              <div className="card" style={{ marginBottom: "20px" }}>
                <div className="card-body" key={key}>
                  <div className="row">
                    <div className="col-md-4">
                      <img
                        src={
                          `${process.env.REACT_APP_BACKEND_URL}/uploads/biopics/` +
                          item.image
                        }
                        className="img mx-auto  rounded-circle"
                        alt=".."
                        style={{ maxHeight: "150px", maxWidth: "150px" }}
                      />
                    </div>
                    <div className="col-md-8">
                      <p>
                        From :<b>{item.name}</b>
                      </p>

                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          this.accept(item.from);
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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

export default connect(mapStateToProps)(withRouter(Request));
