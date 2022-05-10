import "./singlePostView.css"

import React, { useRef, useState } from 'react'

import bg from "../../Extra/instaBg.jpg"

import { useDispatch, useSelector } from "react-redux"
import { hideIndividualPost } from "../../Redux/Feature/individualPostSlice"

import { useNavigate } from "react-router-dom"




function SinglePostView() {
    const display = useSelector(store => store.individualPostDisplayReducer.value)

    const navigate = useNavigate()

    const { selectedImg, userData } = useSelector(store => store.individualPostDisplayReducer)

    // let { All_Images } = useSelector(store => store.selectedUserDataReducer.userData)

    let { id, comments, url, caption, like_count } = selectedImg

    let { Username, ProfilePic } = userData

    // const [comment, setComment] = useState(null)

    const commentRef = useRef()

    const dispatch = useDispatch()


    //EVENTS
    const HideIndividualPost = () => {
        dispatch(hideIndividualPost())
        document.querySelector("body").style.overflowY = "scroll"
    }


    const likePost = (e) => {
        e.target.classList.replace("bi-heart", "bi-heart-fill")
        e.target.style.color = "#ed4956"
    }

    // -----------------------------------------
    // const handleCommentInput = (e) => {
    //     // setComment(e.target.value)
    // }


    // const handleCommentPost = () => {
    //     // if (comment) {
    //     //     const docRef = doc(db, 'registeredUsersCredentials', id)
    //     //     const obj = {
    //     //         comment: comment,
    //     //         userDetails: ""
    //     //     }

    //     //     const Cmnts = [...comments]
    //     //     Cmnts.push(obj)
    //     //     comments = Cmnts

    //     //     All_Images.forEach(IMG => {
    //     //         if (IMG.id === id) {
    //     //             IMG = selectedImg
    //     //         }
    //     //     })

    //     //     updateDoc(docRef, {
    //     //         All_Images
    //     //     })
    //     //     setComment(null)
    //     //     commentRef.current.value = ""
    //     // }
    // }




    return (
        <div className='SinglePostView' style={{ display: display }} >
            <i className="bi bi-x-lg" onClick={HideIndividualPost}></i>
            <div className="individualPostContainer">
                <div className="photoPart">
                    <img src={url} alt="uploadedPost" />
                </div>




                <div className="commentsPart">
                    <div className="commentPartHeader">
                        <div id="img">
                            <img src={ProfilePic} alt="userProfilePic" style={{ cursor: "pointer" }} onClick={() => navigate(`/profile/${Username}`)} />
                        </div>
                        <div id="name">
                            <strong style={{ cursor: "pointer" }} onClick={() => navigate(`/profile/${Username}`)}>{Username}</strong>
                        </div>
                    </div>

                    <div className="allCommentsArea">
                        <div className="Comment captionHolder">
                            <div className="cmtImgCntnr">
                                <img src={ProfilePic} alt="userProfilePic" />
                            </div>
                            <span className="userComment ">
                                <strong>{Username} </strong>
                                {caption}
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
                            <strong id='likesCount'>{like_count} Likes</strong>
                            <small id='daysAgo'>Days ago</small>
                        </div>
                        <div className="postBottomAddComment">
                            <i className="bi bi-emoji-smile emoji"></i>
                            <input type="text" id="textArea" placeholder="Add a comment..." ref={commentRef} />
                            <span className="postOption" >Post</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SinglePostView