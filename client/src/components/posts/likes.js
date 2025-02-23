import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import Fab from "@material-ui/core/Fab";
import FavoriteIcon from "@material-ui/icons/Favorite";
class Like extends React.Component {
  constructor(props) {
    super();
    this.state = {
      show: false,
      count: 0,
    };
  }

  componentDidMount(props) {
    const data = {
      me: this.props.authStatus.user.id,
      postId: this.props.id,
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/user/getlike`, data)
      .then((res) => {
        console.log(res.data);
        this.setState({
          show: true,
          count: res.data.message,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  unlikepost() {
    const data = {
      me: this.props.authStatus.user.id,
      postId: this.props.id,
    };
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/user/unlike`, data)
      .then((res) => {
        this.setState({
          show: false,
          count: res.data.message,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  likepost(props) {
    const data = {
      me: this.props.authStatus.user.id,
      postId: this.props.id,
    };
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/user/setlike`, data, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("loginauth"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        this.setState({
          show: true,
          count: res.data.message,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="d-flex flex-row gap-2 align-items-center">
        <b>{this.state.count}</b>
        <Fab
          size="small"
          aria-label="like"
          style={{ color: this.state.show && "red" }}
          onClick={() => {
            this.state.show ? this.unlikepost() : this.likepost();
          }}
        >
          <FavoriteIcon />
        </Fab>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authStatus: state,
  };
};

export default connect(mapStateToProps)(Like);
