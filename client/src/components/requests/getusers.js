import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navbar from '../homenavbar';
import Userpic from '../auth/images/user.png';
class Getuser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            link: []
        }
    }
    sendrequest(to) {
        const data = {
            name: this.props.authStatus.user.name,
            image: this.props.authStatus.user.image,
            to: to,
            from: this.props.authStatus.user.id
        }
        axios.post("http://localhost:5000/user/send", data, {
            headers: {
                'authorization': "Bearer " + localStorage.getItem("loginauth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            alert(res.data.message);
        }).catch((err) => {
            console.log(err)
        })
    }
    componentDidMount() {
        axios.get("http://localhost:5000/user/users/" + this.props.authStatus.user.id, {
            headers: {
                'authorization': "Bearer " + localStorage.getItem("loginauth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log(res.data.data);
            this.setState({
                link: res.data.data
            })
        }).catch((err) => {
            console.log(err)
        })

    }
    render() {
        if (!this.props.authStatus.isAuthenicated) {
            return <Redirect to='/login' />
        }
        return (
            <div className="container-fluid" >
                <Navbar />
                <div className="container d-flex flex-row flex-wrap " style={{ marginBottom: "10px",marginTop:"80px" }}>
                    {this.state.link.map((item, key) =>
                        <div className="card" style={{ maxWidth: "20rem", margin: "15px", padding: "0" }}>
                            <img className="img-thumbnail mx-auto card-img-top" src={'http://localhost:5000/uploads/biopics/' + item.image} alt="User Image"
                                style={{ maxHeight: "350px", maxWidth: "16rem" }} />
                            <div className="card-body text-center">
                                <h5 className="card-title" key={key}>{item.name}</h5>
                                <ul className="list-group list-group-flush text-center">
                                    <li className="list-group-item">{item.body}</li>
                                </ul>
                            </div>
                            <div className="card-footer mx-auto">
                                <button className="btn btn-primary" onClick={() => { this.sendrequest(item._id) }}>Connect</button>
                            </div>
                        </div>
                    )}


                </div>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        authStatus: state
    }
}

export default connect(mapStateToProps)(Getuser);