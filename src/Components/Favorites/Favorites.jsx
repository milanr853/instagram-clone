import "./favorites.css"
import React from 'react'
import InitialLoading from "../InitialLoading/InitialLoading"
import { useSelector } from "react-redux"




function Favorites() {
    const navVisibility = useSelector(store => store.navbarVisibility.value)

    return (
        navVisibility ? <div className='Favorites'>
            favorites
        </div>
            : <InitialLoading />
    )
}

export default Favorites