import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import FavoriteIcon from '@material-ui/icons/Favorite';
class Like extends React.Component {
    constructor(props) {
        super();
        this.state = {
            show: false,
            count: 0

        }
    }
    unlikepost() {
        const data = {
            me: this.props.authStatus.user.id,
            postId: this.props.id
        }
        axios.post("http://localhost:5000/user/unlike", data).then((res) => {
            this.setState({
                show: false,
                count: res.data.message
            })
        }).catch((err) => {
            console.log(err)
        })
    }
    componentDidMount(props) {
        console.log(this.props.id);
        const data = {
            me: this.props.authStatus.user.id,
            postId: this.props.id
        }
        axios.post("http://localhost:5000/user/getlike", data).then((res) => {
            console.log(res.data);
            this.setState({
                show: true,
                count: res.data.message
            })
        }).catch((err) => {
            console.log(err)
        })
    }
    likepost(props) {
        console.log(this.props);
        const data = {
            me: this.props.authStatus.user.id,
            postId: this.props.id
        }
        axios.put("http://localhost:5000/user/setlike", data, {
            headers: {
                'authorization': "Bearer " + localStorage.getItem("loginauth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            this.setState({
                show: true,
                count: res.data.message
            })
        }).catch((err) => {
            console.log(err)
        })
    }
    render() {
        return (
            <div className="container">
                {this.state.show ?
                    <div style={{padding:"10px"}}><b>{this.state.count}</b><br/> <Fab size="small" aria-label="like" style={{ color: "red" }} onClick={() => { this.unlikepost() }} >
                        <FavoriteIcon />
                    </Fab> </div> :
                    <div style={{padding:"10px 5px"}}><b> {this.state.count}</b><br/><Fab size="small" aria-label="like" onClick={() => { this.likepost() }}>
                        <FavoriteIcon />
                    </Fab></div>
                }

            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        authStatus: state
    }
}

export default connect(mapStateToProps)(Like);