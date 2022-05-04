import "./login.css"

import logo from "../../Extra/instaLogo.png"

import React, { useEffect, useRef, useState } from 'react'

import { Link, useNavigate } from "react-router-dom"

import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../Database/firebaseConfig"




function LoginPage() {
    const [enableLoginBtn, setEnableLoginBtn] = useState("block")

    const [errorMsgVisibility, setErrorMsgVisibility] = useState("none")

    const [passwordLength, setPasswordLength] = useState("")

    const [emailLength, setEmailLength] = useState("")

    const email = useRef()

    const pass = useRef()

    const navigate = useNavigate()

    // ------------Updating States---------------
    const setPassword = () => {
        setPasswordLength(pass.current.value)
    }

    const setUser = () => {
        setEmailLength(email.current.value)
    }

    useEffect(() => {
        if (passwordLength.length >= 6 && emailLength) {
            setEnableLoginBtn("none")
        }
        else setEnableLoginBtn("block")
    }, [passwordLength, emailLength])

    // ----------------------------------



    // -------FIREBASE-AUTHENTICATION--------
    const authenticateUser = () => {
        const user_credential = {
            Email: email.current.value.trim(),
            Password: pass.current.value.trim()
        }

        const { Email, Password } = user_credential

        const login = async () => {
            try {
                await signInWithEmailAndPassword(auth, Email, Password)
                navigate("/")
            }
            catch (error) {
                setErrorMsgVisibility("block")
            }
        }
        login()
    }




    return (
        <div className="Login" >
            <div className="login_Box">
                <img src={logo} alt="logo" className="logo_login" />
                <div className="credentialsWrapper">
                    <input type="text" id="mailInput" placeholder="Email" ref={email} onChange={setUser} />
                    <input type="text" id="passwordInput" placeholder="Password" ref={pass} onChange={setPassword} />
                </div>
                <div className="loginBtnHolder">
                    <button className="loginBtn" onClick={authenticateUser}>Login</button>
                    <button className="loginBtn overTheLoginBtn" style={{ display: enableLoginBtn }}></button>
                </div>

                <div className="errormsg" style={{ display: errorMsgVisibility }}>Email or Password entered wrong</div>
            </div>
            <div className="signUpoption">
                <p>Dont have an account?</p>
                <Link className="signUpLink" to='/signup'>Sign up</Link>
            </div>
        </div>
    )
}

export default LoginPage