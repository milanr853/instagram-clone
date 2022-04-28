import "./explore.css"

import React, { useState } from 'react'

import bg from "../../Extra/instaBg.jpg"
import SearchResultsDisplay from "../SearchResultsDisplay/SearchResultsDisplay"

import { useDispatch } from "react-redux"

import { showContainer } from "../../Redux/Feature/showSearchResultsContainerSlice"


function ExplorePage() {
    const dispatch = useDispatch()

    const [input, setInput] = useState('')

    const SearchResultsContainer = () => {
        dispatch(showContainer())
    }

    const handleChangeEvent = (e) => {
        setInput(e.target.value)
    }



    return (
        <>
            <div className="explorePageHeader">
                <input type="text" className="searchUsersInput" placeholder="Search" onClick={SearchResultsContainer} onChange={handleChangeEvent} />

                <SearchResultsDisplay input={input} />
            </div>

            <div className="Explore">
                <img src={bg} alt="exploreImage" className="explorePageImage" />
                <img src={bg} alt="exploreImage" className="explorePageImage" />
                <img src={bg} alt="exploreImage" className="explorePageImage" />
                <img src={bg} alt="exploreImage" className="explorePageImage" />
                <img src={bg} alt="exploreImage" className="explorePageImage" />
                <img src={bg} alt="exploreImage" className="explorePageImage" />
                <img src={bg} alt="exploreImage" className="explorePageImage" />
                <img src={bg} alt="exploreImage" className="explorePageImage" />
                <img src={bg} alt="exploreImage" className="explorePageImage" />
                <img src={bg} alt="exploreImage" className="explorePageImage" />
                <img src={bg} alt="exploreImage" className="explorePageImage" />
                <img src={bg} alt="exploreImage" className="explorePageImage" />
            </div>
        </>
    )
}

export default ExplorePage