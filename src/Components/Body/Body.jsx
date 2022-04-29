import React, { useEffect } from 'react'
import "./Body.css"

import { Routes, Route, useLocation } from "react-router-dom"




import AllPostsWrapper from "../AllPostsWrapper/AllPostsWrapper"
import Inbox from '../Inbox/Inbox'
import Favorites from "../Favorites/Favorites"
import NotFound from "../NotFound/NotFound"
import Profile from '../Profile/Profile'
import ExplorePage from '../ExplorePage/ExplorePage'

import { setInput } from "../../Redux/Feature/inputSlice"
import { useDispatch } from 'react-redux'


function Body() {
    const dispatch = useDispatch()

    const { pathname } = useLocation()
    useEffect(() => {
        dispatch(setInput(""))
        document.querySelector(".search").value = ""
    }, [pathname])



    return (
        <>
            <div className="Body">
                <Routes>
                    <Route path='/' element={<AllPostsWrapper />} />
                    <Route path='/inbox' element={<Inbox />} />
                    <Route path='/favorites' element={<Favorites />} />
                    <Route path={`/profile/:param`} element={<Profile />} />
                    <Route path='/explore' element={<ExplorePage />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </div>
        </>
    )
}

export default Body