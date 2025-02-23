import React, { useEffect, useState } from "react";
import axios from "axios";
import Like from "./likes";
import { connect } from "react-redux";
import Comment from "./createcomment";
import GetComments from "./getcomment";

function Posts() {
  const [link, setlink] = useState([]);
  const [loader, setloader] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/user/allposts`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("loginauth"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setlink(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setloader(false);
      });
  }, []);

  if (loader) {
    return <div class="loader"></div>;
  }

  return (
    <div className="container row mx-auto">
      <div class="col-md-12 col-lg-12">
        {link.map((item, key) => (
          <div
            className="card"
            key={key}
            style={{ marginBottom: "10px", marginTop: "100px" }}
          >
            <div className="card-header">
              <b> {item.postedBy} </b>
              <span style={{ float: "right" }}>
                <i> {new Date(item.createdAt).toDateString()}</i>
              </span>
            </div>
            <img
              src={
                `${process.env.REACT_APP_BACKEND_URL}/uploads/posts/` +
                item.photo
              }
              className="img card-img-top bordered"
              alt={item.body + "post"}
              width="200"
              height="500"
            />
            <div className="card-body">
              <b> {item.body} </b>
            </div>
            <div className="d-flex flex-row ml-3 align-items-center">
              <Like id={item._id} />
              <Comment id={item._id} />
            </div>
            <div className="row mt-4 mb-4">
              <span className="mb-2 ml-3" style={{ fontWeight: "bold" }}>
                Comments:
              </span>
              <GetComments id={item._id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    authStatus: state,
  };
};

export default connect(mapStateToProps)(Posts);
