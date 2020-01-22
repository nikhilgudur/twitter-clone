import React, { Component, Fragment } from 'react'
import Axios from 'axios'
import { Redirect } from 'react-router-dom'

class Users extends Component {

    constructor(props) {
        super(props)
        this.state = {
            users: [],
            following: [],
            flag: false
        }
    }


    componentDidMount() {
        this.fetchUsers()
    }

    fetchUsers = () => {
        Axios({
            method: 'GET',
            url: `http://127.0.0.1:5000/read/users`,
            headers: {
                "Authorization": `Bearer ${window.localStorage.getItem('token')}`
            }
        })
            .then(res => {
                this.setState({ users: res.data })
            })
            .catch(err => {
                console.log(err)
            })
    }
    
    followUser = (e) => {
        console.log(e.target.id)
        Axios({
            method: 'POST',
            url: `http://127.0.0.1:5000/follow`,
            data: {
                "followee_id": e.target.id
            },
            headers: {
                "Authorization": `Bearer ${window.localStorage.getItem('token')}`
            }
        })
        .then(res => {
            this.setState({ following: res.data, flag: true })
        })
        .catch(err => {
            console.log(err)
        })
    }
    
    render() {

        return (
            <Fragment>
                {this.state.users.map(elm => (
                    <div className="row" key={elm.id}>
                        <div className="col s6 offset-s3">
                            <div className="card deep-purple lighten-5">
                                <div className="card-content black-text">
                                    <h6>{elm.first_name} {elm.last_name}</h6>
                                </div>
                                <div className="card-action">
                                    <button id={elm.id} className="btn deep-purple lighten-3 black-text" onClick={this.followUser}>Follow</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {this.state.flag ? <Redirect to="/tweets" />: <> </> }
            </Fragment>
        )
    }
}

export default Users
