import "./allpostwrapper.css"

import Posts from "../Posts/Posts"
import ReelsHolder from "../ReelsHolder/ReelsHolder"


import React from 'react'

function AllPostsWrapper() {
    return (
        <div className="ALL_POSTS_WRAPPER">
            <ReelsHolder />
            <Posts />
        </div>
    )
}

export default AllPostsWrapper