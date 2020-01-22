import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Nav from './components/Navbar'
import Tweets from './components/Tweets'
import Profile from './components/Profile'
import NewTweet from './components/NewTweet'
import Users from './components/Users'

class App extends Component {
  constructor() {
    super()
    this.state = {
      login: false,
      first_name: "",
      last_name: "",
      email: "",
      picture: ""
    }
  }

  handleLogin = (data) => {
    this.setState({
      login: !this.state.login,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      picture: data.picture
    })
    // console.log(data)
  }


  render() {
    if (!this.state.login) {
      window.localStorage.removeItem('token')
    }

    return (
      <div>
        <Nav logout={this.handleLogin} data={this.state} />
        {this.state.login ?
          <>
            <Route path="/tweets" render={() => <Tweets />} />
            <Route path="/profile" render={() => <Profile />} />
            <Route path="/users" render={() => <Users />} />
            <Route path="/newTweet" render={() => <NewTweet />} />
          </>
          :
          <>
            <Route exact path="/" render={() => <Login login={(data) => this.handleLogin(data)} />} />
            <Route path="/signup" render={() => <Signup />} />
          </>}

      </div>
    )
  }
}

export default App
