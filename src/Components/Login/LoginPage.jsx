import "./login.css"

import logo from "../../Extra/instaLogo.png"


import React from 'react'
import { useDispatch } from "react-redux"

import { makeAuthenticate } from "../../Redux/Feature/isAuthenticated"
import { Link, useNavigate } from "react-router-dom"



function LoginPage() {
    const dispatch = useDispatch()

    const navigate = useNavigate()


    const authenticateUser = () => {
        dispatch(makeAuthenticate())
        navigate("/")
    }


    return (
        <div className="Login" >
            <div className="login_Box">
                <img src={logo} alt="logo" className="logo_login" />
                <div className="credentialsWrapper">
                    <input type="text" id="mailInput" placeholder="Email" />
                    <input type="text" id="passwordInput" placeholder="Password" />
                </div>
                <button className="loginBtn" onClick={authenticateUser}>Login</button>
            </div>
            <div className="signUpoption">
                <p>Dont have an account?</p>
                <Link className="signUpLink" to='/signup'>Sign up</Link>
            </div>
        </div>
    )
}

export default LoginPage