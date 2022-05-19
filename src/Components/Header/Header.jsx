import "./Header.css"
import React, { useEffect, useRef, useState } from 'react'
import logo from "../../Extra/instaLogo.png"
import logoSmall from "../../Extra/insta_logo.png"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { makeOptionsVisible } from "../../Redux/Feature/accountOptionsVisibilitySlice"
import { makeUploadOptionsVisible } from "../../Redux/Feature/uploadPostOptionVisibilitySlice"
import { useDispatch, useSelector } from 'react-redux'
import AccountOptions from "../Accounts/AccountOptions"
import SearchResultsDisplay from "../SearchResultsDisplay/SearchResultsDisplay"
import { showContainer } from "../../Redux/Feature/showSearchResultsContainerSlice"
import { setInput } from "../../Redux/Feature/inputSlice"




function Header() {
    // -------------HOOKS----------------

    const ref = useRef()

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const location = useLocation()

    const [filteredUsers, setFilteredUsers] = useState([])

    const input = useSelector(store => store.inputReducer.input)

    // -------------------------------

    const AllUsers = useSelector(store => store.firestoreDBReducer.value)

    const navVisibility = useSelector(store => store.navbarVisibility.value)

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
        dispatch(setInput(ref.current.value))
    }

    const SearchResultsContainer = () => {
        dispatch(showContainer())
    }



    // ------------------------------------------------
    useEffect(() => {
        if (!ref.current) return
        ref.current.value = ""
    }, [location.pathname])


    useEffect(() => {
        setFilteredUsers(
            [...AllUsers.filter(user => {
                if (input) {
                    if (user.Username.includes(input)) return user
                }
            })]
        )
    }, [input])
    // ------------------------------------------------




    return (
        navVisibility ?
            <div className="Header">
                <div className="headerFlexWrapper">
                    <div className="logoHolder">
                        <Link to="/" id="logoBox">
                            <img className={window.innerWidth <= 400 ? "logoSmall" : "logo"}
                                src={window.innerWidth <= 400 ? logoSmall : logo} alt="logo" />
                        </Link>
                    </div>

                    <div className="inputHolder">
                        <input type="text" className="search" placeholder="Search"
                            onChange={handleChange}
                            onClick={SearchResultsContainer}
                            ref={ref} />

                        <SearchResultsDisplay input={input} usersArr={filteredUsers} />
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
            : <></>

    )
}

export default Header