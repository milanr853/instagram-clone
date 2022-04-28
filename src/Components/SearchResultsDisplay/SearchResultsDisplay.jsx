import "./results.css"

import React from 'react'

import { useSelector } from "react-redux"



function SearchResultsDisplay({ input }) {
    const display = useSelector(store => store.showSearchResultsContainer.value)





    return (
        <div className="SearchResultsDisplay" style={{ display: display }}>
            {
                input ?
                    <>

                        <div className="SearchProfileResult" >
                            <div className="userAvatar">
                                <img src="" alt="" id="userAvatarImage" />
                            </div>
                            <div className="userInfoFromSearchContainer">
                                <strong className="userNameFromSearch">user_name</strong>
                                <p className="fullNameOfUserFromSearch">Full Name of user</p>
                            </div>
                        </div>
                    </>

                    : <p>No Recent Search</p>
            }
        </div>
    )
}

export default SearchResultsDisplay