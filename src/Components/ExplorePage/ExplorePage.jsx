import "./explore.css"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { nanoid } from "@reduxjs/toolkit"
import SearchResultsDisplay from "../SearchResultsDisplay/SearchResultsDisplay"
import { useDispatch, useSelector } from "react-redux"
import { showContainer } from "../../Redux/Feature/showSearchResultsContainerSlice"
import { setInput } from "../../Redux/Feature/inputSlice"
import InitialLoading from "../InitialLoading/InitialLoading"




function ExplorePage() {

    const refr = useRef()

    const dispatch = useDispatch()

    const [filteredUsers, setFilteredUsers] = useState([])

    const input = useSelector(store => store.inputReducer.input)

    const AllUsers = useSelector(store => store.firestoreDBReducer.value)

    const navVisibility = useSelector(store => store.navbarVisibility.value)

    // ------------------------
    const ImgsArrRender = () => {
        const ImgArr = []
        const all = [...AllUsers]
        const IMAGES = all.map(user => user.All_Images.map(obj => obj.url))
        IMAGES.forEach((arr) => {
            arr.forEach(e => ImgArr.push(e))
        })
        return ImgArr.map(url => {
            return (
                <img src={url} alt="exploreImage" className="explorePageImage" key={nanoid()} />
            )
        })
    }

    const renderImages = useMemo(() => ImgsArrRender(), [AllUsers])


    // -------------EVENTS----------------
    const SearchResultsContainer = () => {
        dispatch(showContainer())
    }


    const handleChangeEvent = (e) => {
        dispatch(setInput(refr.current.value))
    }


    useEffect(() => {
        setFilteredUsers(
            [...AllUsers.filter(user => {
                if (input) {
                    if (user.Username.includes(input)) return user
                }
            })]
        )
    }, [input])




    return (
        navVisibility
            ? <>
                <div className="explorePageHeader">
                    <input type="text" className="searchUsersInput" placeholder="Search" onClick={SearchResultsContainer} onChange={handleChangeEvent} ref={refr} />

                    <SearchResultsDisplay input={input} usersArr={filteredUsers} />
                </div>

                <div className="Explore">
                    {renderImages.length !== 0 && renderImages}
                </div>
            </>
            : <InitialLoading />
    )
}

export default React.memo(ExplorePage)