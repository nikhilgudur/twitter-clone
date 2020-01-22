import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

function Navbar(props) {
    return (
        <Fragment>
            <nav>
                <div className="deep-purple lighten-1 nav-wrapper">
                    <ul>
                        {props.data.login ?
                            <>
                                <img className="offset-s6" style={{width:"50px", height:"50px"}} src={`http://127.0.0.1:5000/${props.data.picture}`} alt="" className="circle" />
                                <li><Link to="/tweets">Tweets</Link></li>
                                <li><Link to="/users">Users</Link></li>
                                <li><Link to="/newTweet">New Tweet</Link></li>
                                <li><Link to="/profile">{props.data.first_name}</Link></li>
                                <button className="btn deep-purple lighten-1" onClick={props.logout}>Logout</button>
                            </> :

                            <>
                                <li><Link to="/signup">Sign Up</Link></li>
                                <li><Link to="/" >Login</Link></li>
                            </>
                        }
                    </ul>
                </div>
            </nav>
        </Fragment>
    )
}

export default Navbar
