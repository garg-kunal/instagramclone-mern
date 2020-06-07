import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Like from './likes';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';


class Userpost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            link: [],
        }
    }
    delete(id){
        axios.get("http://localhost:5000/user/delete/" + id, {
            headers: {
                'authorization': "Bearer " + localStorage.getItem("loginauth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res)=>{alert(res.data.message);
            window.location.reload(false);
        }).catch((err)=>console.log(err))

    }
    componentDidMount() {
        axios.get("http://localhost:5000/user/allpost/" + this.props.authStatus.user.id, {
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
                            <Like id={item._id} /> 
                            <IconButton aria-label="delete" onClick={()=>{this.delete(item._id)}}>
                                <DeleteIcon />
                            </IconButton>
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

export default connect(mapStateToProps)(Userpost);