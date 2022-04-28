import "./Posts.css"

import { useDispatch, useSelector } from 'react-redux'




import React from 'react'
import { showIndividualPost } from "../../Redux/Feature/individualPostSlice"

function Posts() {
    const imageData = useSelector(store => store.imagesReducer.value)

    const dispatch = useDispatch()

    const ShowIndividualPost = () => {
        dispatch(showIndividualPost())
        document.querySelector("body").style.overflowY = "hidden"
    }




    const renderPosts_Images =
        imageData.map((elem) => {
            const { id, urls } = elem
            const { thumb, regular } = urls

            return (
                <div className="PostContainer" key={id}>
                    <div className="postHeader">
                        <div className="userImageContainer">
                            <img src={thumb} alt="userImage" className="userImage" />
                        </div>
                        <h4 className="postUserName">Username</h4>
                        <i className="bi bi-three-dots"></i>
                    </div>
                    <img className="postImage" src={regular} alt="postImage" style={{ cursor: "pointer" }} onClick={ShowIndividualPost} />
                    <div className="postBottom">
                        <div className="postBottomIconsBar">
                            <i className="bi bi-heart postBottomIcons"></i>
                            <i className="bi bi-share postBottomIcons"></i>
                            <i className="bi bi-dash-square postBottomIcons" onClick={ShowIndividualPost}></i>
                        </div>
                        <div className="postBottomInfoBlock">
                            <strong id='likesCount'>xxxLikesCount</strong>
                            <p className="postCaption"><strong>Username</strong> this is a demo caption Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio pariatur totam harum quisquam iure rerum. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, ullam? </p>
                            <p className="viewAllComments" onClick={ShowIndividualPost}>View all xxx comments</p>
                            <small id='daysAgo'>Days ago</small>
                        </div>
                        <div className="postBottomAddComment">
                            <i className="bi bi-emoji-smile emoji"></i>
                            <input type="text" id="textArea" placeholder="Add a comment..." />
                            <span className="postOption">Post</span>
                        </div>
                    </div>
                </div>
            )
        })


    return (
        <>
            {imageData.length !== 0 && renderPosts_Images}
        </>
    )
}

export default Posts