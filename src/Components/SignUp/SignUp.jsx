import "./signup.css"

import React from 'react'

import logo from "../../Extra/instaLogo.png"
import { Link, useNavigate } from "react-router-dom"
import { makeAuthenticate } from "../../Redux/Feature/isAuthenticated"
import { useDispatch } from "react-redux"



function SignUp() {
    const dispatch = useDispatch()

    const navigate = useNavigate()


    const authenticateUser = () => {
        dispatch(makeAuthenticate())
        navigate("/")
    }


    return (
        <div className="Signup" >
            <div className="signup_Box">
                <img src={logo} alt="logo" className="logo_signup" />
                <div className="credentialsWrapper">
                    <input type="text" className="mailInput" placeholder="Email" />
                    <input type="text" className="fullNameInput" placeholder="Full Name" />
                    <input type="text" className="userNameInput" placeholder="Username" />
                    <input type="text" className="passwordInput" placeholder="Password" />
                </div>
                <button className="signupBtn" onClick={authenticateUser}>Sign up</button>
            </div>
            <div className="logInoption">
                <p>Have an account?</p>
                <Link to='/log-in' className='logInLink'>Log in</Link>
            </div>
        </div>
    )
}

export default SignUp