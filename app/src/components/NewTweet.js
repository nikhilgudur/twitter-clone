import React, { Component, Fragment } from 'react'
import Axios from 'axios'

class NewTweet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tweet: ""
        }
    }

    handleChange = (e) => {
        this.setState({ tweet: e.target.value })
    }

    postTweet = (e) => {
        e.preventDefault()
        Axios({
            method: 'POST',
            url: "http://127.0.0.1:5000/create/tweet",
            data: {
                "tweet": this.state.tweet
            },
            headers: {
                "Authorization": `Bearer ${window.localStorage.getItem('token')}`
            }

        })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <Fragment>
                <div className="row">
                    <form className="col s4 offset-s4" onSubmit={this.postTweet}>
                        <div className="row">
                            <label htmlFor="tweet">Tweet</label>
                            <input value={this.state.tweet} id="tweet" onChange={(e) => this.handleChange(e)} className="validate" />
                            <button className="btn deep-purple lighten-1" type="submit">Tweet</button>
                        </div>
                    </form>
                </div>
            </Fragment>
        )
    }
}

export default NewTweet
