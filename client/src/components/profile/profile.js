import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import { Close, ThreeSixtyRounded } from "@material-ui/icons";
class Bio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raw: "",
      preview: "",
      msg: "",
      status: "",
      show: true,
    };
  }

  show() {
    this.setState({
      show: false,
    });
  }

  imageHandler = (e) => {
    this.setState({
      preview: URL.createObjectURL(e.target.files[0]),
      raw: e.target.files[0],
    });
  };

  statushandler = (e) => {
    this.setState({ status: e.target.value });
  };

  post = (e) => {
    e.preventDefault();
    if (this.state.status.length === 0 || this.state.preview.length === 0) {
      alert("files required");
      return;
    }
    const formData = new FormData();

    formData.append("photo", this.state.raw);
    formData.append("body", this.state.status);
    formData.append("mainId", this.props.authStatus.user.id);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/user/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "Bearer " + localStorage.getItem("loginauth"),
        },
      })
      .then((res) => {
        alert(res.data.message);
        window.location.reload();
        this.setState({
          show: true,
          raw: "",
          preview: "",
          body: "",
        });
      })
      .catch((err) => {
        this.setState({
          msg: "Bio Not Added",
        });
        console.log(err);
      });
  };

  render() {
    return (
      <div className="container">
        {this.state.show ? (
          <div className="fixed-bottom offset-md-11">
            <Fab
              variant="extended"
              color="primary"
              onClick={() => {
                this.show();
              }}
              aria-label="add"
              style={{ float: "right", margin: "20px" }}
            >
              <EditIcon />
              &nbsp;Update Profile
            </Fab>
          </div>
        ) : (
          <div
            className="text-center container mx-auto mt-5 border-1"
            style={{
              boxShadow: "0 0 10px 0 rgba(100, 100, 100, 0.5)",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <Fab
              color="secondary"
              onClick={() => {
                this.setState({
                  show: true,
                });
              }}
              aria-label="close"
              style={{ float: "right", margin: "20px" }}
            >
              <Close />
            </Fab>
            <h1 className="text-center">Update Profile</h1>
            <img
              src={
                this.state.preview ||
                "https://nutristyle.com/wp-content/uploads/2020/06/bio-photo-placeholder.png"
              }
              className="img  rounded-circle"
              height="200"
              width="200"
              alt="Selected"
            />
            <form className="form-group mt-4 mx-auto">
              <input
                type="text"
                required
                placeholder="Bio Status"
                onChange={(e) => {
                  this.statushandler(e);
                }}
                value={this.state.status}
                className="form-control mx-auto border-0"
              />
              <br />
              <input
                type="file"
                className="form-control mx-auto border-0"
                accept=".jpg,.png,.jpeg"
                onChange={(e) => {
                  this.imageHandler(e);
                }}
              />
              <br />
              <button
                type="submit"
                onClick={(e) => {
                  this.post(e);
                }}
                className="btn btn-primary"
              >
                Add
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authStatus: state,
  };
};

export default connect(mapStateToProps)(Bio);
