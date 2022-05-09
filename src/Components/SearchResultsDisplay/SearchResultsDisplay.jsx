import "./results.css"

import React from 'react'

import { useSelector } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

import { Link } from "react-router-dom"





function SearchResultsDisplay({ usersArr }) {
    const display = useSelector(store => store.showSearchResultsContainer.value)

    // --------------------------




    const relevantUsers = usersArr.length !== 0 && usersArr.map(user => {
        const { Username, Fullname, ProfilePic } = user

        return (
            <Link to={`/profile/${Username}`} className="SearchProfileResult" key={nanoid()} >
                <div className="userAvatar">
                    <img src={ProfilePic} alt="user_image" id="userAvatarImage" />
                </div>
                <div className="userInfoFromSearchContainer">
                    <strong className="userNameFromSearch">{Username}</strong>
                    <p className="fullNameOfUserFromSearch">{`${Fullname}`}</p>
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