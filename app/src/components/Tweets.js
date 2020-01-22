import React, { Component, Fragment } from 'react'
import Axios from 'axios'
// import { Link } from 'react-router-dom'

class Tweets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tweets: [],
            page: 0
        }
    }

    componentDidMount() {
        Axios({
            method: 'GET',
            url: `http://127.0.0.1:5000/read/tweets?offset=${this.state.page}`,
            headers: {
                "Authorization": `Bearer ${window.localStorage.getItem('token')}`
            }
        })
            .then(res => {
                this.setState({ tweets: res.data })
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    pageInc = () => {
        var page = this.state.page + 1
        this.setState({ page : page * 20 })
    }

    pageDec = () => {
        var page = this.state.page + 1
        this.setState({page : page * 20})
    }

    render() {
        return (
            <Fragment>
                {this.state.tweets.map(elm => (
                    <div className="row" key={elm.id}>
                        <div className="col s6 offset-s3">
                            <div className="card deep-purple lighten-5">
                            <div className="card-content black-text">
                                    <p>{elm.tweet_body}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={this.pageInc}>Prev</button> <button onClick={this.pageDec}>Next</button>
            </Fragment>
        )
    }
}

export default Tweets

// http://127.0.0.1:5000/profile
// http://127.0.0.1:5000/read/tweets