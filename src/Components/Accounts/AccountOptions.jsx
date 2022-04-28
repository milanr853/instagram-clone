import React from 'react'

import "./options.css"

import { useDispatch, useSelector } from 'react-redux'

import { logOut } from "../../Redux/Feature/isAuthenticated"

import { Link } from "react-router-dom"



function AccountOptions() {
    const dispatch = useDispatch()

    const optionsVisibility = useSelector(store => store.accountOptionsVisibilityReducer.value)

    const logoutUser = () => {
        dispatch(logOut())
    }


    return (
        <>
            <div className="AccountOptionsHolder" style={{ display: optionsVisibility }}>
                <ul>
                    <Link to='/profile' className='accountOption'><i className="bi bi-person"></i> Profile</Link>
                    <li className='accountOption'><i className="bi bi-gear"></i> Settings</li>
                    <li className='accountOption' onClick={logoutUser}><i className="bi bi-box-arrow-right"></i> Logout</li>
                </ul>
            </div>
        </>
    )
}

export default AccountOptions