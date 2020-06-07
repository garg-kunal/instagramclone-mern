import React from 'react';
import axios from 'axios';

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            link: []
        }

    }
    componentDidMount(props) {
        axios.get("http://localhost:5000/user/getcmt/" + this.props.id, {
            headers: {
                'authorization': "Bearer " + localStorage.getItem("loginauth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log(res.data);
            this.setState({
                link: res.data.data
            })
            console.log(res.data.data);
        }).catch((err) => {
            console.log(err)
        })

    }
    render() {
        return (
            <div style={{ overflow: "auto", height: "100px",padding:"50px" }}>
                Comments Are Under
                {
                    this.state.link.map((item) =>
                        <div className="card border-0 d-flex flex-column" style={{ margin: "20px", borderRadius: "25px" }}>
                            <div className="card-footer border-0" style={{ backgroundColor: "lightgrey", borderRadius: "25px" }}>
                                <span>Comment By: {item.postedBy}</span> 
                               &nbsp;&nbsp;<b> {item.body}</b>
                            </div>
                        </div>)
                }
            </div>
        )
    }

}