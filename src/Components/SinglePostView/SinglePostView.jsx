import "./singlePostView.css"

import React from 'react'

import bg from "../../Extra/instaBg.jpg"

import { useDispatch, useSelector } from "react-redux"
import { hideIndividualPost } from "../../Redux/Feature/individualPostSlice"


function SinglePostView() {
    const display = useSelector(store => store.individualPostDisplayReducer.value)

    const dispatch = useDispatch()

    const HideIndividualPost = () => {
        dispatch(hideIndividualPost())
        document.querySelector("body").style.overflowY = "scroll"
    }


    const likePost = (e) => {
        e.target.classList.replace("bi-heart", "bi-heart-fill")
        e.target.style.color = "#ed4956"
    }



    return (
        <div className='SinglePostView' style={{ display: display }} >
            <i className="bi bi-x-lg" onClick={HideIndividualPost}></i>
            <div className="individualPostContainer">
                <div className="photoPart">
                    <img src={bg} alt="" />
                </div>




                <div className="commentsPart">
                    <div className="commentPartHeader">
                        <div id="img">
                            <img src={bg} alt="" />
                        </div>
                        <div id="name">
                            <strong>user_name</strong>
                        </div>
                    </div>

                    <div className="allCommentsArea">
                        <div className="Comment">
                            <div className="cmtImgCntnr">
                                <img src={bg} alt="" />
                            </div>
                            <span className="userComment">
                                <strong>user_name </strong>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate laboriosam repudiandae numquam Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, optio. fugiat veritatis eius tempora quod ipsa laborum totam.
                            </span>
                        </div>
                        <div className="Comment">
                            <div className="cmtImgCntnr">
                                <img src={bg} alt="" />
                            </div>
                            <span className="userComment">
                                <strong>user_name </strong>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate laboriosam repudiandae numquam Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, optio. fugiat veritatis eius tempora quod ipsa laborum totam.
                            </span>
                        </div>
                    </div>

                    <div className="commentPartBottom">
                        <div className="postBottomIconsBar">
                            <i className="bi bi-heart postBottomIcons" onClick={likePost}></i>
                            <i className="bi bi-share postBottomIcons"></i>
                            <i className="bi bi-dash-square postBottomIcons"></i>
                        </div>
                        <div className="postBottomInfoBlock">
                            <strong id='likesCount'>xxxLikesCount</strong>
                            <small id='daysAgo'>Days ago</small>
                        </div>
                        <div className="postBottomAddComment">
                            <i className="bi bi-emoji-smile emoji"></i>
                            <input type="text" id="textArea" placeholder="Add a comment..." />
                            <span className="postOption">Post</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SinglePostView