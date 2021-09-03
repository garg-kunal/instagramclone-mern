import React, { useEffect, useState } from "react";
import axios from "axios";
import Like from "./likes";
import { connect } from "react-redux";
import Comment from "./createcomment";
import Get from "./getcomment";

function Showprofile() {
    const [link, setlink] = useState([]);
    const [loader, setloader] = useState(true);

    useEffect(() => {



        axios
            .get("http://localhost:5000/user/allposts", {
                headers: {
                    authorization: "Bearer " + localStorage.getItem("loginauth"),
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                setlink(res.data.data);
                setloader(false);


            })
            .catch((err) => {
                console.log(err);
                setloader(false);

            });
    }, []);


    return (
        <> {loader ?
            <div class="loader" ></div> :
            <div className="container row mx-auto">
                <div class="col-md-8 col-lg-8">

                    {link.map((item, key) => (
                        <div
                            className="card"
                            key={key}
                            style={{ marginBottom: "10px", marginTop: "100px" }}
                        >
                            <div className="card-header">
                                <b> {item.postedBy} </b>
                                <span style={{ float: "right" }}>
                                    <i> {item.createdAt} </i>
                                </span>
                            </div>
                            <img
                                src={"http://localhost:5000/uploads/posts/" + item.photo}
                                className="img card-img-top bordered"
                                alt="post"
                                width="200"
                                height="500"
                            />
                            <div className="card-body">
                                <b> {item.body} </b>
                            </div>
                            <div className="row">
                                <div class="col-md- 1">
                                    <Like id={item._id} />
                                </div>
                                <div class="col-md-1">
                                    <Comment id={item._id} />
                                </div>
                                <div class="col-md"></div>



                            </div>
                            <div className="row" >
                                <Get id={item._id} />
                            </div>
                        </div>
                    ))}
                </div>
                <div class="col-md-4 col-lg-4"  style={{ marginBottom: "10px", marginTop: "100px" }}>
                   <img src="https://source.unsplash.com/weekly?water/100*50" width="450px"/>
                    </div>
            </div>
        }</>
    );

}

const mapStateToProps = (state) => {
    return {
        authStatus: state,
    };
};

export default connect(mapStateToProps)(Showprofile);
