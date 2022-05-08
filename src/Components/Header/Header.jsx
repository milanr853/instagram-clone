import "./Header.css"
import React, { useEffect, useRef, useState } from 'react'

import logo from "../../Extra/instaLogo.png"

import { Link, useLocation, useNavigate } from "react-router-dom"

import { makeOptionsVisible } from "../../Redux/Feature/accountOptionsVisibilitySlice"
import { makeUploadOptionsVisible } from "../../Redux/Feature/uploadPostOptionVisibilitySlice"

import { useDispatch, useSelector } from 'react-redux'
import AccountOptions from "../Accounts/AccountOptions"
import SearchResultsDisplay from "../SearchResultsDisplay/SearchResultsDisplay"
import { showContainer } from "../../Redux/Feature/showSearchResultsContainerSlice"
import { getRequiredData } from "../../Redux/Feature/usersSlice"

import { setInput } from "../../Redux/Feature/inputSlice"



function Header() {
    // -------------HOOKS----------------
    const input = useSelector(store => store.inputReducer.input)

    const [filteredUsers, setFilteredUsers] = useState([])

    const ref = useRef()

    const dispatch = useDispatch()

    const navigate = useNavigate()
    const location = useLocation()



    // -------------------------------

    let allUsers = useSelector(store => store.userReducer.allFetched)

    useEffect(() => { dispatch(getRequiredData(allUsers)) }, [allUsers])

    const AllUsers = useSelector(store => store.userReducer.requiredData)


    // --------------EVENTS--------------------

    const showAccountOptions = () => {
        dispatch(makeOptionsVisible())
    }

    const showUploadOptions = () => {
        dispatch(makeUploadOptionsVisible())
        document.querySelector("body").style.overflowY = "hidden"
    }


    const takeToExplore = () => {
        if (location.pathname !== "/explore") navigate("/explore")

        dispatch(showContainer())
    }

    const handleChange = () => {
        dispatch(setInput(ref.current.value.trim()))
    }


    // ------------------------------------------------
    useEffect(() => {
        setFilteredUsers(
            [...AllUsers.filter(user => {
                if (input) {
                    if (user.login.username.includes(input)) return user
                }
            })]
        )
    }, [input])




    return (
        <>
            <div className="Header">
                <div className="headerFlexWrapper">
                    <div className="logoHolder">
                        <Link to="/" id="logoBox"><img className="logo" src={logo} alt="logo" /></Link>
                    </div>

                    <div className="inputHolder">
                        <input type="text" className="search" placeholder="Search" onClick={takeToExplore} onChange={handleChange} ref={ref} />

                        <SearchResultsDisplay usersArr={filteredUsers} />
                    </div>

                    <div className="iconsHolder">
                        <Link to='/' className="headerLink door"><i className="bi bi-house-door headerLinkIcon"></i></Link>

                        <i className="bi bi-search headerIcon" onClick={takeToExplore}></i>

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