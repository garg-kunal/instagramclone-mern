import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            raw: "",
            preview: "",
            msg: "",
            status: "",
            show: true
        }
    }
    statushandler = (e) => {
        this.setState({ status: e.target.value })
    }

    post = (e) => {
        e.preventDefault();
        const data = {
            comment: this.state.status,
            me: this.props.authStatus.user.name,
            postId: this.props.id
        }
        axios.post('http://localhost:5000/user/comment', data, {
            headers: {
                'authorization': "Bearer " + localStorage.getItem("loginauth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            alert(res.data.message);
            this.setState({
                raw: "",
                preview: "",
                status: "",
                show: true
            })
        }
        ).catch((err) => {
            this.setState({
                msg: "Post Not Posted"
            })
            console.log(err);
        })

    }
    show() {
        this.setState({
            show: false
        })
    }

    render() {
        return (
            <div className="container-fluid">
                {this.state.show ?
                <div style={{padding:" 10px 0px"}}>
                    <br/>
                        <Fab color="Secondary" size="small" onClick={() => { this.show() }} aria-label="edit">
                            <EditIcon />
                        </Fab></div> : <div className="text-center">
                        <form className="form-group">
                            <input type="text" required placeholder="Comment"
                                onChange={(e) => { this.statushandler(e) }}
                                value={this.state.status}
                                className="form-control border-0" />
                            <button type="submit" onClick={(e) => { this.post(e) }} className="btn btn-primary">Add</button>
                        </form>
                    </div>}
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        authStatus: state
    }
}

export default connect(mapStateToProps)(Comment);