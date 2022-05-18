import "./allpostwrapper.css"
import Posts from "../Posts/Posts"
import React from 'react'
import ReelsHolder from "../ReelsHolder/ReelsHolder"




function AllPostsWrapper() {
    return (
        <div className="ALL_POSTS_WRAPPER">
            {/* <ReelsHolder /> */}
            <Posts />
        </div>
    )
}

export default AllPostsWrapper