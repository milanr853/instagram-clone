import "./explore.css"

import React, { useEffect, useRef, useState } from 'react'

import { nanoid } from "@reduxjs/toolkit"

import SearchResultsDisplay from "../SearchResultsDisplay/SearchResultsDisplay"

import { useDispatch, useSelector } from "react-redux"

import { showContainer } from "../../Redux/Feature/showSearchResultsContainerSlice"

import { setInput } from "../../Redux/Feature/inputSlice"



function ExplorePage() {
    const refr = useRef()

    const [filteredUsers, setFilteredUsers] = useState([])

    const dispatch = useDispatch()

    const input = useSelector(store => store.inputReducer.input)

    const allImages = useSelector(store => store.imagesReducer.value)

    const AllUsers = useSelector(store => store.firestoreDBReducer.value)


    // -------------EVENTS----------------
    const SearchResultsContainer = () => {
        dispatch(showContainer())
    }

    const handleChangeEvent = (e) => {
        dispatch(setInput(refr.current.value))
    }

    // ---------------------------------------


    // ----------------ARRAY------------------
    const renderImages = allImages ?
        allImages.map(obj => {
            const { regular } = obj.urls
            return (
                <img src={regular} alt="exploreImage" className="explorePageImage" key={nanoid()} />
            )
        })
        : []


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
        <>
            <div className="explorePageHeader">
                <input type="text" className="searchUsersInput" placeholder="Search" onClick={SearchResultsContainer} onChange={handleChangeEvent} ref={refr} />

                <SearchResultsDisplay input={input} usersArr={filteredUsers} />
            </div>

            <div className="Explore">
                {renderImages.length !== 0 && renderImages}
            </div>
        </>
    )
}

export default ExplorePage