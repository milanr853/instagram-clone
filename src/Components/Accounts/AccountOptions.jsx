import "./options.css"
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from "react-router-dom"
import { signOut } from 'firebase/auth'
import { auth } from '../../Database/firebaseConfig'



function AccountOptions() {

    const navigate = useNavigate()

    const optionsVisibility =
        useSelector(store =>
            store.accountOptionsVisibilityReducer.value)

    const { Username } =
        useSelector(store =>
            store.selectedUserDataReducer.authUserData)


    //EVENT
    const logoutUser = async () => {
        await signOut(auth)
        navigate("/login")
    }




    return (
        <>
            <div className="AccountOptionsHolder"
                style={{ display: optionsVisibility }}>
                <ul>
                    <Link to={Username ? `/profile/${Username}/auth-user` : "/profile"}
                        className='accountOption'>
                        <i className="bi bi-person"></i> Profile
                    </Link>
                    <li className='accountOption'>
                        <i className="bi bi-gear"></i>Settings
                    </li>
                    <li className='accountOption' onClick={logoutUser}>
                        <i className="bi bi-box-arrow-right"></i>Logout
                    </li>
                </ul>
            </div>
        </>
    )
}

export default AccountOptions