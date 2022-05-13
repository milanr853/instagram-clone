import "./singlePostView.css"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import defaultImg from "../../Extra/default.jpg"
import { useDispatch, useSelector } from "react-redux"
import { hideIndividualPost } from "../../Redux/Feature/individualPostSlice"
import { useNavigate } from "react-router-dom"
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore"
import { db } from "../../Database/firebaseConfig"
import { nanoid } from "@reduxjs/toolkit"




function SinglePostView() {
    const navigate = useNavigate()

    const display = useSelector(store => store.individualPostDisplayReducer.value)

    const { selectedImg, userData } = useSelector(store => store.individualPostDisplayReducer)

    let authUserData = useSelector(store => store.selectedUserDataReducer.userData)

    let { id, url, caption, like_count } = selectedImg

    let { Username, ProfilePic, ID } = userData

    const [comment, setComment] = useState(null)

    const commentRef = useRef()

    const [commentsArr, setCommentsArr] = useState([])

    const dispatch = useDispatch()


    //EVENTS
    const HideIndividualPost = () => {
        dispatch(hideIndividualPost())
        commentRef.current.value = ''
        setComment(null)
        document.querySelector("body").style.overflowY = "scroll"
    }


    const likePost = (e) => {
        e.target.classList.replace("bi-heart", "bi-heart-fill")
        e.target.style.color = "#ed4956"
    }


    // -----------------------------------------
    const handleCommentInput = (e) => {
        setComment(e.target.value)
    }


    const AddCommentPost = async () => {
        if (!comment.trim()) return

        commentRef.current.value = ""

        const docRef = collection(db, "registeredUsersCredentials", ID, `CommentsFor${id}`)


        await addDoc(docRef, {
            comment: comment.trim(),
            comentedUsername: authUserData?.Username,
            comentedProfilePic: authUserData?.ProfilePic ? authUserData?.ProfilePic : "",
            timestamp: serverTimestamp()
        })

        setComment(null)
    }


    useEffect(() => {
        if (!id) return

        const getAllComments = async () => {
            const docRef = onSnapshot(query(collection(db, "registeredUsersCredentials", ID, `CommentsFor${id}`),
                orderBy('timestamp', 'desc')), snapshot => setCommentsArr(snapshot.docs))
        }
        getAllComments()
    }, [id, db])


    const CommentsList = () => {
        const cmntsList = commentsArr.map(obj => {
            const { comment, comentedProfilePic, comentedUsername } = obj.data()
            console.log("apple")
            return (
                <div className="Comment" key={nanoid()}>
                    <div className="cmtImgCntnr">
                        <img src={comentedProfilePic ? comentedProfilePic : defaultImg} alt="profilePic" />
                    </div>
                    <span className="userComment">
                        <strong>{comentedUsername} </strong>
                        {comment}
                    </span>
                </div>
            )
        })
        return cmntsList
    }


    const renderComments = useMemo(() => CommentsList(), [commentsArr])




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
                        {renderComments}

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
                            <input type="text" id="textArea" placeholder="Add a comment..." ref={commentRef} onChange={handleCommentInput} />
                            <span className="postOption" onClick={AddCommentPost}>Post</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SinglePostView