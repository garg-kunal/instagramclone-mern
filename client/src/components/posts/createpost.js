import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
class Create extends React.Component {
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
        const formData = new FormData();
        formData.append('photo', this.state.raw);
        formData.append('body', this.state.status);
        formData.append("user", this.props.authStatus.user.name);
        formData.append('mainId', this.props.authStatus.user.id);

        axios.post('http://localhost:5000/user/post', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'authorization': "Bearer " + localStorage.getItem("loginauth"),
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
                    <div className="fixed-bottom offset-md-11">
                        <Fab color="primary" onClick={() => { this.show() }} aria-label="add" style={{ float: "right", margin: "20px" }}>
                            <AddIcon />
                        </Fab></div> : <div className="mx-auto text-center" style={{ marginBottom: "10px",marginTop:"80px" }}>
                        <img src={this.state.preview} className="img  img-thumbnail mx-auto" height="200" width="200" alt="Selected" />
                        <form className="form-group">
                            <input type="text" required placeholder="Post Status"
                                onChange={(e) => { this.statushandler(e) }}
                                value={this.state.status}
                                className="form-control border-0 mx-auto" /><br />
                            <input type="file" className="form-control border-0 mx-auto"
                                accept=".jpg,.png,.jpeg"
                                onChange={(e) => { this.imageHandler(e) }}
                            />
                            <br />
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

export default connect(mapStateToProps)(Create);