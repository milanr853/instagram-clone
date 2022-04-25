import "./Header.css"
import React from 'react'

import logo from "../../Extra/instaLogo.png"

import { Link } from "react-router-dom"

import { makeOptionsVisible } from "../../Redux/Feature/accountOptionsVisibilitySlice"
import { makeUploadOptionsVisible } from "../../Redux/Feature/uploadPostOptionVisibilitySlice"

import { useDispatch } from 'react-redux'
import AccountOptions from "../Accounts/AccountOptions"



function Header() {
    const dispatch = useDispatch()

    const showAccountOptions = () => {
        dispatch(makeOptionsVisible())
    }

    const showUploadOptions = () => {
        dispatch(makeUploadOptionsVisible())
    }


    return (
        <>
            <div className="Header">
                <div className="headerFlexWrapper">
                    <div className="logoHolder">
                        <Link to="/" id="logoBox"><img className="logo" src={logo} alt="logo" /></Link>
                    </div>
                    <div className="inputHolder">
                        <input type="text" className="search" placeholder="Search" />
                    </div>
                    <div className="iconsHolder">
                        <Link to='/' className="headerLink door"><i className="bi bi-house-door headerLinkIcon"></i></Link>

                        <i className="bi bi-search headerIcon"></i>

                        <Link to='/inbox' className="headerLink"><i className="bi bi-send headerLinkIcon"></i></Link>

                        <i className="bi bi-plus-square headerIcon" onClick={showUploadOptions}></i>

                        <Link to='/favorites' className="headerLink"><i className="bi bi-heart headerLinkIcon"></i></Link>

                        <i className="bi bi-person-circle headerIcon" onClick={showAccountOptions}></i>

                        <AccountOptions />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header