import React from "react";
import axios from "axios";

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: [],
    };
  }
  componentDidMount(props) {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/user/getcmt/` + this.props.id,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("loginauth"),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        this.setState({
          link: res.data.data,
        });
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div
        className="container"
        style={{ overflow: "auto", maxHeight: "100px", padding: "50px" }}
      >
        {this.state.link.map((item, index) => (
          <div
            key={index}
            className="card border-0 d-flex flex-column"
            style={{ padding: "8px", backgroundColor: "lightgrey" }}
          >
            <span style={{ fontSize: "12px" }}>
              Comment By: {item.postedBy}
            </span>
            <span style={{ fontWeight: "500" }}>{item.body}</span>
          </div>
        ))}
      </div>
    );
  }
}
