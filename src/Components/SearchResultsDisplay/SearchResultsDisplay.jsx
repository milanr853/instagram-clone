import "./results.css"

import React from 'react'

import { useSelector } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

import { Link } from "react-router-dom"





function SearchResultsDisplay({ usersArr }) {
    const display = useSelector(store => store.showSearchResultsContainer.value)

    // --------------------------




    const relevantUsers = usersArr.length !== 0 && usersArr.map(user => {
        const { login, name, picture } = user

        return (
            <Link to={`/profile/${login.username}`} className="SearchProfileResult" key={nanoid()} >
                <div className="userAvatar">
                    <img src={picture.thumbnail} alt="user_image" id="userAvatarImage" />
                </div>
                <div className="userInfoFromSearchContainer">
                    <strong className="userNameFromSearch">{login.username}</strong>
                    <p className="fullNameOfUserFromSearch">{`${name.first} ${name.last}`}</p>
                </div>
            </Link>
        )
    })




    return (
        <div className="SearchResultsDisplay" style={{ display: display }}>
            {
                usersArr.length !== 0 ?
                    <>
                        {relevantUsers}
                    </>
                    : <p>No Search Result</p>
            }
        </div>
    )
}

export default SearchResultsDisplay