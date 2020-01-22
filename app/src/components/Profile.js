import React, { Component, Fragment } from 'react'
import Axios from 'axios'
// import { Link } from 'react-router-dom'

class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tweets: [],
            picture: ""
        }
    }


    componentDidMount() {
        Axios({
            method: 'GET',
            url: `http://127.0.0.1:5000/profile`,
            headers: {
                "Authorization": `Bearer ${window.localStorage.getItem('token')}`
            }
        })
            .then(res => {
                this.setState({ tweets: res.data })
            })
            .catch(err => {
                console.log(err)
            })
    }

    onChange = (e) => {
        var file = e.target.files[0];
        this.setState({ picture: file });
        console.log(this.state.picture)
    }

    uploadPhoto = () => {
        let formData = new FormData()
        formData.append('picture', this.state.picture,)
        Axios({
            method: 'POST',
            url: `http://127.0.0.1:5000/user/picture`,
            data: formData,
            headers: {
                "Authorization": `Bearer ${window.localStorage.getItem('token')}`
            }
        })
            .then(res => {
                alert('File uploaded')
                console.log(res)
                // this.setState({picture: ""})
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col s6 offset-s3" >
                        <input className="btn deep-purple lighten-1" type="file" onChange={(e) => this.onChange(e)}
                            id="avatar" name="avatar"
                            accept="image/png, image/jpeg" />
                        <button className="btn deep-purple lighten-1" onClick={this.uploadPhoto}>Upload</button>
                    </div>
                    {this.state.tweets.map(elm => (
                        <div className="row" key={elm.id}>
                            <div className="col s6 offset-s3 ">
                                <div className="card deep-purple lighten-5">
                                    <div className="card-content black-text">
                                        <p>{elm.tweet_body}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Fragment>
        )
    }
}

export default Profile
