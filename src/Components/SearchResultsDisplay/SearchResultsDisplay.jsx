import "./results.css"
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import defaultImage from "../../Constant/defaultImage"




function SearchResultsDisplay({ usersArr }) {

    const display = useSelector(store => store.showSearchResultsContainer.value)

    const navigate = useNavigate()

    const [relevantUsers, setRelevantUsers] = useState()
    // --------------------------


    useEffect(() => {
        const arr = usersArr.length !== 0 && usersArr.map(user => {
            const { Username, Fullname, ProfilePic } = user

            const takeToProfile = (e) => {
                navigate(`/profile/${Username}`)
            }
            return (
                <div className="SearchProfileResult" key={nanoid()} id={Username} onClick={takeToProfile}>
                    <div className="userAvatar">
                        <img src={ProfilePic ? ProfilePic : defaultImage} alt="user_image" id="userAvatarImage" />
                    </div>
                    <div className="userInfoFromSearchContainer">
                        <strong className="userNameFromSearch">{Username}</strong>
                        <p className="fullNameOfUserFromSearch">{`${Fullname}`}</p>
                    </div>
                </div>
            )
        })
        setRelevantUsers(arr)
    }, [usersArr])


    // const relevantUsers = usersArr.length !== 0 && usersArr.map(user => {
    //     const { Username, Fullname, ProfilePic } = user
    //     const takeToProfile = (e) => {
    //         navigate(`/profile/${Username}`)
    //     }
    //     console.log("äpple")
    //     return (
    //         <div className="SearchProfileResult" key={nanoid()} id={Username} onClick={takeToProfile}>
    //             <div className="userAvatar">
    //                 <img src={ProfilePic ? ProfilePic : defaultImage} alt="user_image" id="userAvatarImage" />
    //             </div>
    //             <div className="userInfoFromSearchContainer">
    //                 <strong className="userNameFromSearch">{Username}</strong>
    //                 <p className="fullNameOfUserFromSearch">{`${Fullname}`}</p>
    //             </div>
    //         </div>
    //     )
    // })





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

export default React.memo(SearchResultsDisplay)