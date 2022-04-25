import "./Header.css"
import React from 'react'

import logo from "../../Extra/instaLogo.png"

import { Link } from "react-router-dom"

import { makeOptionsVisible } from "../../Redux/Feature/accountOptionsVisibilitySlice"

import { useDispatch } from 'react-redux'



function Header() {
    const dispatch = useDispatch()

    const showAccountOptions = () => {
        dispatch(makeOptionsVisible())
    }


    return (
        <>
            <div className="Header">
                <div className="headerFlexWrapper">
                    <div className="logoHolder">
                        <img className="logo" src={logo} alt="logo" />
                    </div>
                    <div className="inputHolder">
                        <input type="text" className="search" placeholder="Search" />
                    </div>
                    <div className="iconsHolder">
                        <Link to='/' className="headerLink door"><i className="bi bi-house-door headerLinkIcon"></i></Link>

                        <i className="bi bi-search headerIcon"></i>

                        <Link to='/inbox' className="headerLink"><i className="bi bi-send headerLinkIcon"></i></Link>

                        <i className="bi bi-plus-square headerIcon"></i>

                        <Link to='/favorites' className="headerLink"><i className="bi bi-heart headerLinkIcon"></i></Link>

                        <i className="bi bi-person-circle headerIcon" onClick={showAccountOptions}></i>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header