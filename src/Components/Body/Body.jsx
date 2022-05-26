import "./Body.css"
import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from "react-router-dom"
import Inbox from '../Inbox/Inbox'
import Favorites from "../Favorites/Favorites"
import NotFound from "../NotFound/NotFound"
import Profile from '../Profile/Profile'
import ExplorePage from '../ExplorePage/ExplorePage'
import { setInput } from "../../Redux/Feature/inputSlice"
import { useDispatch } from 'react-redux'
import AuthProfile from "../Profile/AuthProfile"
import Settings from "../Settings/Settings"
import Posts from "../Posts/Posts"




function Body() {
    const dispatch = useDispatch()

    const { pathname } = useLocation()



    // ---------------------------
    // useEffect(() => {
    //     dispatch(setInput(""))
    // }, [pathname])




    return (
        <>
            <div className="Body">
                <Routes>
                    <Route path='/' element={<Posts />} />
                    <Route path='/inbox' element={<Inbox />} />
                    <Route path='/favorites' element={<Favorites />} />
                    <Route path={`/profile/:param`} element={<Profile />} />
                    <Route path={`/profile/:param/auth-user`} element={<AuthProfile />} />
                    <Route path='/explore' element={<ExplorePage />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </div>
        </>
    )
}

export default Body