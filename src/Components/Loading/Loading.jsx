import React from 'react'

import "./loading.css"

import loading from "../../Extra/loading.gif"


function Loading() {
    return (
        <div className='loadingHolder'>
            <img src={loading} alt="spinner" id="spinner" />
        </div>
    )
}

export default Loading