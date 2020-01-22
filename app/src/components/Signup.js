import React, { Component, Fragment } from 'react'
import Axios from 'axios'

class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }

    handleChange = (e) => {
        this.setState({[e.target.id]: e.target.value})
    }

    handleSignup= (e) => {
        e.preventDefault()
        Axios({
            method:'POST',
            url: `http://127.0.0.1:5000/register`,
            data:{
                "first_name":this.state.first_name,
                "last_name":this.state.last_name,
                "email":this.state.email,
                "password":this.state.password
            }
        })
        .then(res => {
            alert("Registered")
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <Fragment>
                <div className="row">
                    <form className="col s4 offset-s4" onSubmit={this.handleSignup}>
                        <div className="row" >
                            <div className="input-field col-s6">
                                <input onChange={(e) => {this.handleChange(e)}} value={this.state.first_name} id="first_name" type="text" className="validate" />
                                <label htmlFor="first_name">First Name</label>
                            </div>
                            <div className="input-field col-s6">
                                <input onChange={(e) => {this.handleChange(e)}} value={this.state.last_name} id="last_name" type="text" className="validate" />
                                <label htmlFor="last_name">Last Name</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input onChange={(e) => {this.handleChange(e)}} id="email" type="email" className="validate" />
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input onChange={(e) => {this.handleChange(e)}} id="password" type="password" className="validate" />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                        <button className="btn waves-effect waves-light #7e57c2 deep-purple lighten-1" type="submit">Sign Up</button>
                    </form>
                </div>
            </Fragment>
        )
    }
}

export default Signup
