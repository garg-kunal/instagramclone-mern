import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
class Bio extends React.Component {
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
    show() {
        this.setState({
            show: false
        })
    }
    imageHandler = (e) => {
        this.setState({
            preview: URL.createObjectURL(e.target.files[0]),
            raw: e.target.files[0]
        })
    }
    statushandler = (e) => {
        this.setState({ status: e.target.value })
    }
    post = (e) => {
        e.preventDefault();
        if (this.state.status.length === 0 || this.state.preview.length===0) {
            alert("files required");
        } else {
            const formData = new FormData();


            formData.append('photo', this.state.raw);
            formData.append('body', this.state.status);
            formData.append('mainId', this.props.authStatus.user.id);
            axios.post('http://localhost:5000/user/profile', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'authorization': "Bearer " + localStorage.getItem("loginauth"),
                }
            }).then((res) => {
                alert(res.data.message);
                window.location.reload();
                this.setState({
                    show: true,
                    raw: "",
                    preview: "",
                    body: ""
                })
            }
            ).catch((err) => {
                this.setState({
                    msg: "Bio Not Added"
                })
                console.log(err);
            })
        }

    }
    render() {
        return (
            <div className="container">
                {this.state.show ? <div className="fixed-bottom">
                    <span align="right" style={{ float: "right", margin: "20px" }} >Update Profile</span>
                    <Fab color="primary" onClick={() => { this.show() }} aria-label="add" style={{ float: "right", margin: "20px" }}>
                        <AddIcon />
                    </Fab> </div> : <div>
                    <img src={this.state.preview} className="img  rounded-circle" height="200" width="200" alt="Selected" />
                    <form className="form-group">
                        <input type="text" required placeholder="Bio Status"
                            onChange={(e) => { this.statushandler(e) }}
                            value={this.state.status}
                            className="form-control border-0" /><br />
                        <input type="file" className="form-control border-0"
                            accept=".jpg,.png,.jpeg"
                            onChange={(e) => { this.imageHandler(e) }}
                        />
                        <br />
                        <button type="submit" onClick={(e) => { this.post(e) }} className="btn btn-primary">Add</button>
                    </form>
                </div>
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

export default connect(mapStateToProps)(Bio);