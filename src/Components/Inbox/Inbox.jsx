import "./inbox.css"
import React from 'react'
import InitialLoading from "../InitialLoading/InitialLoading"
import { useSelector } from "react-redux"




function Inbox() {
    const navVisibility = useSelector(store => store.navbarVisibility.value)

    return (
        navVisibility ?
            <div className='Inbox'>
            </div>
            : <InitialLoading />
    )
}

export default Inbox