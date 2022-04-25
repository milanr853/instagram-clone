import React from 'react'
import "./Body.css"

import { Routes, Route } from "react-router-dom"

import AccountOptions from "../Accounts/AccountOptions"



import AllPostsWrapper from "../AllPostsWrapper/AllPostsWrapper"
import Inbox from '../Inbox/Inbox'
import Favorites from "../Favorites/Favorites"

function Body() {
    return (
        <>
            <div className="Body">
                <AccountOptions />
                <Routes>
                    <Route path='/' element={<AllPostsWrapper />} />
                    <Route path='/inbox' element={<Inbox />} />
                    <Route path='/favorites' element={<Favorites />} />
                </Routes>
            </div>
        </>
    )
}

export default Body