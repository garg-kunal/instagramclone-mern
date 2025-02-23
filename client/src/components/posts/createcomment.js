import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import CloseIcon from "@material-ui/icons/Close";
import CommentIcon from "@material-ui/icons/Comment";
class Comment extends React.Component {
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
  statushandler = (e) => {
    this.setState({ status: e.target.value });
  };

  post = (e) => {
    e.preventDefault();
    const data = {
      comment: this.state.status,
      me: this.props.authStatus.user.name,
      postId: this.props.id,
    };
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/user/comment`, data, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("loginauth"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        alert("Comment Posted!");
        this.setState({
          raw: "",
          preview: "",
          status: "",
          show: true,
        });
      })
      .catch((err) => {
        this.setState({
          msg: "Unable to Post Comment",
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
          <Fab
            color="Secondary"
            size="small"
            onClick={() => {
              this.show();
            }}
            aria-label="edit"
          >
            <CommentIcon />
          </Fab>
        ) : (
          <div className="text-center">
            <form className="d-flex flex-row gap-2">
              <input
                type="text"
                required
                placeholder="Type Here...."
                onChange={(e) => {
                  this.statushandler(e);
                }}
                value={this.state.status}
                className="form-control border-0"
              />
              <Fab
                color="Secondary"
                size="small"
                onClick={(e) => {
                  this.post(e);
                }}
                aria-label="send"
              >
                <SendIcon />
              </Fab>
              <Fab
                color="Secondary"
                size="small"
                onClick={(e) => {
                  this.setState({ show: true });
                }}
                aria-label="close"
              >
                <CloseIcon />
              </Fab>
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

export default connect(mapStateToProps)(Comment);
