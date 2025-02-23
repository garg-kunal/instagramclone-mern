import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { Close } from "@material-ui/icons";
class Create extends React.Component {
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
    if (this.state.status.length === 0) {
      alert("Please Fill these Fields....");
      return;
    }

    if (this.state.raw === "") {
      alert("Please Select an Image....");
      return;
    }
    
    const formData = new FormData();
    formData.append("photo", this.state.raw);
    formData.append("body", this.state.status);
    formData.append("user", this.props.authStatus.user.name);
    formData.append("mainId", this.props.authStatus.user.id);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/user/post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "Bearer " + localStorage.getItem("loginauth"),
        },
      })
      .then((res) => {
        alert(res.data.message);
        this.setState({
          raw: "",
          preview: "",
          status: "",
          show: true,
        });
      })
      .catch((err) => {
        this.setState({
          msg: "Unable to Post....",
        });
        console.log(err);
      });
  };
  show() {
    this.setState({
      show: false,
    });
  }

  render() {
    return (
      <div className="container-fluid">
        {this.state.show ? (
          <div className="fixed-bottom offset-md-11">
            <Fab
              color="primary"
              onClick={() => {
                this.show();
              }}
              aria-label="add"
              style={{ float: "right", margin: "20px" }}
            >
              <AddIcon />
            </Fab>
          </div>
        ) : (
          <div
            className="d-flex flex-column text-center"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "500px",
              height: this.state.preview ? "auto" : "300px",
              zIndex: "5555",
              backgroundColor: "white",
              padding: "10px",
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
              borderRadius: "10px",
            }}
          >
            <Fab
              color="primary"
              size="small"
              onClick={() => {
                this.setState({ show: true });
              }}
              aria-label="close"
            >
              <CloseIcon />
            </Fab>
            {this.state.preview && (
              <img
                src={this.state.preview}
                className="img  img-thumbnail mx-auto"
                height="200"
                width="200"
                alt="Selected"
              />
            )}
            <form className="form-group">
              <textarea
                type="text"
                required
                rows={3}
                columns={8}
                placeholder="Type here.."
                onChange={(e) => {
                  this.statushandler(e);
                }}
                value={this.state.status}
                className="form-control mx-auto"
                style={{ borderRadius: "0" }}
              />
              <br />
              <input
                type="file"
                className="form-control border-0 mx-auto"
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
                className="btn btn-primary mx-auto d-flex flex-row"
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

export default connect(mapStateToProps)(Create);
