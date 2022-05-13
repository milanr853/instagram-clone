import "./singlePostView.css"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import defaultImg from "../../Extra/default.jpg"
import { useDispatch, useSelector } from "react-redux"
import { hideIndividualPost } from "../../Redux/Feature/individualPostSlice"
import { useNavigate } from "react-router-dom"
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "../../Database/firebaseConfig"
import { nanoid } from "@reduxjs/toolkit"
import moment from "moment"




function SinglePostView() {

    const navigate = useNavigate()

    const display = useSelector(store => store.individualPostDisplayReducer.value)

    const { selectedImg, userData } = useSelector(store => store.individualPostDisplayReducer)

    let authUserData = useSelector(store => store.selectedUserDataReducer.userData)

    let { id, url, caption, timestamp } = selectedImg

    timestamp = new Date(timestamp)

    let { Username, ProfilePic, ID } = userData

    const [comment, setComment] = useState(null)

    const commentRef = useRef()

    const [commentsArr, setCommentsArr] = useState([])

    const [likesArr, setLikesArr] = useState([])

    const [authUserLiked, setAuthUserLiked] = useState(false)

    const dispatch = useDispatch()


    //EVENTS
    const HideIndividualPost = () => {
        dispatch(hideIndividualPost())
        commentRef.current.value = ''
        setComment(null)
        document.querySelector("body").style.overflowY = "scroll"
    }



    //Comments Part____________________
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
            onSnapshot(query(collection(db, "registeredUsersCredentials", ID, `CommentsFor${id}`),
                orderBy('timestamp', 'desc')), snapshot => setCommentsArr(snapshot.docs))
        }
        getAllComments()
    }, [id, db])


    const CommentsList = () => {
        const cmntsList = commentsArr.map(obj => {
            const { comment, comentedProfilePic, comentedUsername } = obj.data()
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
    // -------------------------------------



    //Likes Part____________________
    const AddLikeData = async () => {
        if (authUserLiked) {
            const docRef = doc(db, "registeredUsersCredentials", ID, `LikesFor${id}`, authUserData?.Username)
            deleteDoc(docRef)
            setAuthUserLiked(false)
            return
        }
        else {
            const docRef = doc(db, "registeredUsersCredentials", ID, `LikesFor${id}`, authUserData?.Username)
            await setDoc(docRef, {
                authUser: authUserData?.Username,
            })
        }
    }


    useEffect(() => {
        if (!id) return
        const getAllLikes = async () => {
            onSnapshot(query(collection(db, "registeredUsersCredentials", ID, `LikesFor${id}`),
            ), snapshot => setLikesArr(snapshot.docs))
        }
        getAllLikes()
    }, [id, db])


    const likedByUsersList = useMemo(() => {
        return likesArr.map(obj => {
            const { authUser } = obj.data()
            return authUser
        })
    }, [likesArr])


    useEffect(() => {
        if (likedByUsersList.includes(authUserData.Username)) setAuthUserLiked(true)
        else setAuthUserLiked(false)
    }, [likedByUsersList])
    // -------------------------------------




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
                            <img src={ProfilePic ? ProfilePic : defaultImg} alt="userProfilePic" style={{ cursor: "pointer" }} onClick={() => navigate(`/profile/${Username}`)} />
                        </div>
                        <div id="name">
                            <strong style={{ cursor: "pointer" }} onClick={() => navigate(`/profile/${Username}`)}>{Username}</strong>
                        </div>
                    </div>

                    <div className="allCommentsArea">
                        <div className="Comment captionHolder">
                            <div className="cmtImgCntnr">
                                <img src={ProfilePic ? ProfilePic : defaultImg} alt="userProfilePic" />
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
                            <i className={`bi ${authUserLiked ? "bi-heart-fill" : "bi-heart"} postBottomIcons`}
                                style={{ color: authUserLiked ? "#ed4956" : "" }}
                                onClick={AddLikeData}></i>
                            <i className="bi bi-share postBottomIcons"></i>
                            <i className="bi bi-dash-square postBottomIcons"></i>
                        </div>
                        <div className="postBottomInfoBlock">
                            <strong id='likesCount'>{likesArr.length} Likes</strong>
                            <small id='daysAgo'>{timestamp ? moment(timestamp).fromNow() : ''}</small>
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

export default React.memo(SinglePostView)