import "./singlePostView.css"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import defaultImg from "../../Extra/default.jpg"
import { useDispatch, useSelector } from "react-redux"
import { hideIndividualPost } from "../../Redux/Feature/individualPostSlice"
import { useNavigate } from "react-router-dom"
import {
    addDoc, collection,
    deleteDoc, doc,
    onSnapshot, orderBy,
    query, serverTimestamp,
    setDoc, updateDoc
} from "firebase/firestore"
import { db } from "../../Database/firebaseConfig"
import { nanoid } from "@reduxjs/toolkit"
import moment from "moment"
import { removeIDs } from "../../Redux/Feature/likePostSlice"
import {
    WhatsappShareButton
} from "react-share";




function SinglePostView() {

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const likeData = useSelector(store => store.likePostReducer)

    const display = useSelector(store => store.individualPostDisplayReducer.value)

    let authUserData = useSelector(store => store.selectedUserDataReducer.authUserData)

    const { selectedImg, userData } = useSelector(store => store.individualPostDisplayReducer)

    let { id, url, caption, timestamp } = selectedImg

    timestamp = new Date(timestamp)

    let { Username, ProfilePic, ID } = userData

    const [comment, setComment] = useState(null)

    const commentRef = useRef()

    const [commentsArr, setCommentsArr] = useState([])

    const [likesArr, setLikesArr] = useState([])

    const [authUserLiked, setAuthUserLiked] = useState(false)

    const CommentTrim = comment?.trim()


    //EVENTS
    const HideIndividualPost = () => {
        dispatch(hideIndividualPost())
        commentRef.current.value = ''
        setComment(null)
        document.querySelector("body").style.overflowY = "scroll"
        dispatch(removeIDs())
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
            commentedUserId: authUserData?.id,
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
            const uid = nanoid()


            return (
                <div className="Comment" key={uid}  >
                    <div className="cmtImgCntnr">
                        <img src={comentedProfilePic ? comentedProfilePic : defaultImg} alt="profilePic" />
                    </div>
                    <span className="userComment">
                        <strong className="SinglePostViewProfileUserName"
                            onClick={
                                () => {
                                    HideIndividualPost()
                                    navigate(`/profile/${comentedUsername}`)
                                }}
                        >{comentedUsername}</strong>
                        {" " + comment}
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
        if (!id && !likeData.ImageID) return
        const getAllLikes = async () => {
            onSnapshot(query(collection(db,
                "registeredUsersCredentials", likeData.UserID ? likeData.UserID : ID, `LikesFor${likeData.ImageID ? likeData.ImageID : id}`),
            ), snapshot => setLikesArr(snapshot.docs))
        }
        getAllLikes()
    }, [id, db, likeData])


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
    useEffect(() => {
        if (!id && !likeData.ImageID) return
        const Doc = doc(db, "mainDisplayPosts", likeData.ImageID ? likeData.ImageID : id)
        updateDoc(Doc, {
            postImage_like_count: likesArr.length,
            postImage_comment_count: commentsArr.length,
            authUserClicked: authUserLiked
        })
    }, [likesArr, commentsArr, authUserLiked])


    useEffect(() => {
        if (!likeData.UserID) return
        if (likeData.authLike) {
            const docRef = doc(db, "registeredUsersCredentials",
                likeData.UserID, `LikesFor${likeData.ImageID}`, authUserData?.Username)
            deleteDoc(docRef)
            setAuthUserLiked(false)
            return
        }
        else {
            const docRef = doc(db, "registeredUsersCredentials",
                likeData?.UserID, `LikesFor${likeData?.ImageID}`, authUserData?.Username)
            setDoc(docRef, {
                authUser: authUserData?.Username,
            })
        }

    }, [likeData,])




    return (
        <div className='SinglePostView' style={{ display: display }} >
            <i className="bi bi-x-lg" onClick={HideIndividualPost}></i>
            <div className="individualPostContainer">
                <div className="photoPart">
                    <img src={url} alt="uploadedPost" />
                </div>




                <div className="commentsPart" >
                    <div className="commentPartHeader">
                        <div id="img">
                            <img src={ProfilePic ? ProfilePic : defaultImg} alt="userProfilePic" />
                        </div>
                        <div id="name">
                            <strong className="SinglePostViewProfileUserName"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    HideIndividualPost()
                                    navigate(`/profile/${Username}`)
                                }}>{Username ? Username : ""}</strong>
                        </div>
                    </div>

                    <div className="allCommentsArea">
                        <div className="Comment captionHolder">
                            <div className="cmtImgCntnr">
                                <img src={ProfilePic ? ProfilePic : defaultImg} alt="userProfilePic" />
                            </div>
                            <span className="userComment"
                                onClick={() => {
                                    HideIndividualPost()
                                    navigate(`/profile/${Username}`)
                                }}>
                                <strong className="SinglePostViewProfileUserName">{Username}</strong>
                                {caption ? " " + caption : ""}
                            </span>
                        </div>

                        {/* ------------------------- */}
                        {renderComments}
                        {/* ------------------------- */}

                    </div>

                    <div className="commentPartBottom">
                        <div className="postBottomIconsBar">
                            <i className={`bi ${authUserLiked ? "bi-heart-fill" : "bi-heart"} `}
                                style={{ color: authUserLiked ? "#ed4956" : "" }}
                                onClick={AddLikeData}></i>
                            <WhatsappShareButton url={"https://www.instagram.com/"}>
                                <i className="bi bi-share "></i>
                            </WhatsappShareButton>
                            <i className="bi bi-bookmark "></i>
                        </div>
                        <div className="postBottomInfoBlock">
                            <strong id='likesCount'>{likesArr.length} Likes</strong>
                            <small id='daysAgo'>{timestamp ? moment(timestamp).fromNow() : ''}</small>
                        </div>
                        <div className="postBottomAddComment">
                            <i className="bi bi-emoji-smile emoji"></i>
                            <input type="text" id="textArea" placeholder="Add a comment..." ref={commentRef} onChange={handleCommentInput} />
                            <span className="postOption"
                                style={{
                                    opacity: CommentTrim ? "1" : '0.6'
                                }}
                                onClick={AddCommentPost}>Post</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default React.memo(SinglePostView)