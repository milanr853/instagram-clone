import "./login.css"
import logo from "../../Extra/instaLogo.png"
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../Database/firebaseConfig"




function LoginPage() {
    const [errorMsgVisibility, setErrorMsgVisibility] = useState("none")

    const [disableBtn, setDisableBtn] = useState(true)

    const [passwordLength, setPasswordLength] = useState("")

    const [emailLength, setEmailLength] = useState("")

    const emailRef = useRef()

    const passRef = useRef()

    const navigate = useNavigate()

    // ------------Updating States---------------
    const setPassword = () => {
        setPasswordLength(passRef.current.value)
    }


    const setEmail = () => {
        setEmailLength(emailRef.current.value)
    }


    useEffect(() => {
        if (passwordLength.length >= 6 && emailLength) {
            setDisableBtn(false)
        }
        else setDisableBtn(true)
    }, [passwordLength, emailLength])
    // ----------------------------------


    // -------FIREBASE-AUTHENTICATION--------
    const authenticateUser = () => {
        setDisableBtn(true)
        const user_credential = {
            Email: emailRef.current.value.trim(),
            Password: passRef.current.value.trim()
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
    // --------------------------------------------



    return (
        <div className="Login" >
            <div className="login_Box">
                <img src={logo} alt="logo" className="logo_login" />
                <div className="credentialsWrapper">
                    <input type="text" id="mailInput" placeholder="Email" ref={emailRef} onChange={setEmail} />
                    <input type="text" id="passwordInput" placeholder="Password" ref={passRef} onChange={setPassword} />
                </div>
                <div className="loginBtnHolder">
                    <button className="loginBtn" disabled={disableBtn}
                        style={{
                            opacity: disableBtn ? "0.7" : "1",
                            cursor: disableBtn ? 'default' : "pointer",
                        }}
                        onClick={authenticateUser}
                    >Login</button>
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