import "./signup.css"
import React, { useEffect, useRef, useState } from 'react'
import logo from "../../Extra/instaLogo.png"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../Database/firebaseConfig"
import { addDoc, collection } from "firebase/firestore"




function SignUp() {

    const [passwordLength, setPasswordLength] = useState("")

    const [usernameLength, setUsernameLength] = useState("")

    const [fullnameLength, setFullnameLength] = useState("")

    const [allUsersData, setAllUsersData] = useState([])

    const [disableBtn, setDisableBtn] = useState(true)

    const [mailLength, setMailLength] = useState("")

    const [errorMsg, setErrorMsg] = useState('')

    const navigate = useNavigate()

    const fullname = useRef()

    const mail = useRef()

    const name = useRef()

    const pass = useRef()

    const All_Data = useSelector(store => store.firestoreDBReducer.value)

    // --------------------EVENTS---------------------

    const setPassword = () => {
        setPasswordLength(pass.current.value)
    }

    const setUser = () => {
        setUsernameLength(name.current.value)
    }

    const setFullname = () => {
        setFullnameLength(fullname.current.value)
    }

    const setMail = () => {
        setMailLength(mail.current.value)
    }
    // ------------------------------------

    useEffect(() => {
        if (passwordLength.length >= 6 && usernameLength && fullnameLength && mailLength) {
            setDisableBtn(false)
        }
        else setDisableBtn(true)
    }, [passwordLength, usernameLength, fullnameLength, mailLength])


    useEffect(() => { setAllUsersData(All_Data) }, [All_Data])


    useEffect(() => {
        const strArr = usernameLength.split(" ")
        if (strArr.length > 1) {
            setDisableBtn(true)
        }
    }, [usernameLength])


    // -----------------FIREBASE-REGISTRATION------------------
    const authenticateUser = () => {
        setDisableBtn(true)
        const user_credential = {
            Email: mail.current.value.trim(),
            Fullname: fullname.current.value.toLowerCase().trim(),
            Username: name.current.value.toLowerCase().trim(),
            PassWord: pass.current.value.trim(),
            All_Images: []
        }

        const { Username, Email, PassWord } = user_credential

        const register = async () => {
            try {
                //Create User in Firebase Authentication
                await createUserWithEmailAndPassword(auth, Email, PassWord)
                //Create User in Firestore DB
                const userCollectionRef = collection(db, "registeredUsersCredentials")
                addDoc(userCollectionRef, user_credential)
                navigate("/")
            }
            catch (error) {
                const Error = error.message.split("/")
                setErrorMsg(Error[1].split(")")[0])
            }
        }

        if (allUsersData.length === 0) register()
        else {
            for (let i = 0; i < allUsersData.length; i++) {
                if (allUsersData[i].Username === Username) {
                    setErrorMsg("Username already exists")
                    break
                }
                else if (i === allUsersData.length - 1) {
                    register()
                }
            }
        }

    }




    return (
        <div className="Signup" >
            <div className="signup_Box">
                <img src={logo} alt="logo" className="logo_signup" />
                <div className="credentialsWrapper">
                    <input type="text" className="mailInput" placeholder="Email" ref={mail} onChange={setMail} />
                    <input type="text" className="fullNameInput" placeholder="Full Name" ref={fullname} onChange={setFullname} maxLength={50} />
                    <input type="text" className="userNameInput" placeholder="Username" ref={name} onChange={setUser} maxLength={50} />
                    <input type="text" className="passwordInput" placeholder="Password" ref={pass} onChange={setPassword} maxLength={20} />
                </div>
                <div className="signupBtnHolder">
                    <button className="signupBtn" disabled={disableBtn}
                        style={{
                            cursor: disableBtn ? "default" : "pointer",
                            opacity: disableBtn ? "0.7" : "1"
                        }}
                        onClick={authenticateUser}>Sign up</button>
                </div>
                <div className="errorMessage">{errorMsg}</div>
            </div>
            <div className="logInoption">
                <p>Have an account?</p>
                <Link to='/log-in' className='logInLink'>Log in</Link>
            </div>
        </div>
    )
}

export default SignUp