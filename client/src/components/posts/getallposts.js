import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Like from './likes';
import Comment from './createcomment';
import Get from './getcomment';
class Showprofile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            link: [],
            followers: 0,
            follows: 0
        }
    }
    componentDidMount() {
        axios.get("http://localhost:5000/user/allposts", {
            headers: {
                'authorization': "Bearer " + localStorage.getItem("loginauth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            this.setState({
                link: res.data.data
            })
        }).catch((err) => {
            console.log(err)
        })

    }
    render() {
        return (
            <div className="container">
                {this.state.link.map((item, key) =>
                    <div className="card" key={key} style={{ marginBottom: "10px", marginTop: "80px" }}>
                        <div className="card-header">
                            <b> {item.postedBy}</b><span style={{ float: "right" }}><i>{item.createdAt}</i></span>
                        </div>
                        <img src={'http://localhost:5000/uploads/posts/' + item.photo}
                            className="img card-img-top bordered" alt="post" height="500" />
                        <div className="card-body">
                            <b>{item.body}</b>
                        </div>
                        <div className="card-footer">
                            <Like id={item._id} /><br />
                            <Comment id={item._id} /><br />
                            <Get id={item._id} />
                        </div>
                    </div>
                )}
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        authStatus: state
    }
}

export default connect(mapStateToProps)(Showprofile);