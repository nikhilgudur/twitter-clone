import React, { Component, Fragment } from 'react'
import Axios from 'axios'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            login: false
        }
    }

    handleChange = (e) => {
        this.setState({[e.target.id]: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault()

        Axios({
            method: 'POST',
            url: `http://127.0.0.1:5000/login`,
            data: {
                "email": this.state.email,
                "password": this.state.password
            }
        })
        .then(res => {
            if(res.data.status === 401) {
                alert("Wrong Password")
            }
            else{
                this.setState({login: true})
                window.localStorage.setItem('token', res.data.token)
                this.props.login(res.data)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    render() {
        return (
            <Fragment>
                <div className="row">
                    <form onSubmit={this.handleSubmit} className="col s4 offset-s5">
                        <div className="row">
                            <div className="input-field col s6">
                                <input value={this.state.email} onChange={(e) => {this.handleChange(e)}} id="email" type="text" className="validate" />
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                                <input value={this.state.password} onChange={(e) => {this.handleChange(e)}} id="password" type="password" className="validate" />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                        <button className="btn waves-effect waves-light deep-purple lighten-1" type="submit">Login</button>
                    </form>
                </div>
            </Fragment>
        )
    }
}

export default Login
