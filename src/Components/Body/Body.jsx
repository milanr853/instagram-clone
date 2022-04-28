import React from 'react'
import "./Body.css"

import { Routes, Route } from "react-router-dom"




import AllPostsWrapper from "../AllPostsWrapper/AllPostsWrapper"
import Inbox from '../Inbox/Inbox'
import Favorites from "../Favorites/Favorites"
import NotFound from "../NotFound/NotFound"
import Profile from '../Profile/Profile'
import ExplorePage from '../ExplorePage/ExplorePage'




function Body() {



    return (
        <>
            <div className="Body">
                <Routes>
                    <Route path='/' element={<AllPostsWrapper />} />
                    <Route path='/inbox' element={<Inbox />} />
                    <Route path='/favorites' element={<Favorites />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/explore' element={<ExplorePage />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </div>
        </>
    )
}

export default Body