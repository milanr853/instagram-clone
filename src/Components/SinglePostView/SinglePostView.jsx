import "./singlePostView.css"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { hideIndividualPost } from "../../Redux/Feature/individualPostSlice"
import { useNavigate } from "react-router-dom"
import {
    addDoc, arrayUnion, collection,
    deleteDoc, doc,
    getDoc,
    onSnapshot, orderBy,
    query, serverTimestamp,
    setDoc, updateDoc
} from "firebase/firestore"
import { db } from "../../Database/firebaseConfig"
import { nanoid } from "@reduxjs/toolkit"
import moment from "moment"
import {
    WhatsappShareButton
} from "react-share";
import defaultImage from "../../Constant/defaultImage"
import { collectImageAndUserInfoToDeletePost, setShowDeleteOption } from "../../Redux/Feature/deleteOptionVisibility"




function SinglePostView() {

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const display = useSelector(store => store.individualPostDisplayReducer.value)

    let authUserData = useSelector(store => store.selectedUserDataReducer.authUserData)

    const { selectedImg, userData } = useSelector(store => store.individualPostDisplayReducer)

    let { id, url, caption, timestamp } = selectedImg

    timestamp = new Date(timestamp)

    let { Username, ProfilePic, ID } = userData

    const [comment, setComment] = useState(null)

    const commentRef = useRef()

    const [commentsArr, setCommentsArr] = useState([])

    const [bookmarkArray, setBookmarksArr] = useState([])

    const [likesArr, setLikesArr] = useState([])

    const [authUserLiked, setAuthUserLiked] = useState(false)

    const CommentTrim = comment?.trim()


    //EVENTS
    const showDeleteOption = () => {
        document.querySelector("body").style.overflowY = "hidden"
        dispatch(collectImageAndUserInfoToDeletePost({
            Username: Username,
            Image_ID: id,
            User_ID: ID
        }))
        dispatch(setShowDeleteOption())
    }


    const HideIndividualPost = () => {
        document.querySelector("body").style.overflowY = "scroll"
        dispatch(hideIndividualPost())
        commentRef.current.value = ''
        setComment(null)
    }


    //COMMENTS PART____________________
    const handleCommentInput = (e) => {
        setComment(e.target.value)
    }


    //Add Comment || Creating comment
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
    // ------------------------



    //Get Comments-data from Firebase __registeredUsersCredentials__ coll
    useEffect(() => {
        if (!id) return
        const getAllComments = async () => {
            onSnapshot(query(collection(db, "registeredUsersCredentials", ID, `CommentsFor${id}`),
                orderBy('timestamp', 'desc')), snapshot => setCommentsArr(snapshot.docs))
        }
        getAllComments()
    }, [id, db])


    //Render Comments List
    const CommentsList = () => {
        const cmntsList = commentsArr.map(obj => {
            const { comment, comentedProfilePic, comentedUsername } = obj.data()
            const uid = nanoid()


            return (
                <div className="Comment" key={uid}  >
                    <div className="cmtImgCntnr">
                        <img src={comentedProfilePic ? comentedProfilePic : defaultImage} alt="profilePic" />
                    </div>
                    <span className="userComment">

                        <strong className="SinglePostViewProfileUserName" onClick={() => {
                            HideIndividualPost()
                            navigate(`/profile/${comentedUsername}`)
                        }}>{comentedUsername}
                        </strong>

                        {" " + comment}
                    </span>
                </div>
            )
        })
        return cmntsList
    }


    const renderComments = useMemo(() => CommentsList(), [commentsArr])

    // -------------------------------------


    //LIKES PART____________________
    //Getting the likes data of particular image from Firebase __registeredUsersCredentials__
    useEffect(() => {
        if (!id) return
        const getAllLikes = async () => {
            onSnapshot(query(collection(db,
                "registeredUsersCredentials", ID,
                `LikesFor${id}`),
            ), snapshot => setLikesArr(snapshot.docs))
        }
        getAllLikes()
    }, [id, db,])


    //mapping the names of 'user liked' of the particular image to a List 
    const likedByUsersList = useMemo(() => {
        return likesArr.map(obj => {
            const { authUser } = obj.data()
            return authUser
        })
    }, [likesArr])


    //checking if auth.Username is included in the 'likedByUsersList' and then setting the 'setAuthUserLiked'
    useEffect(() => {
        if (likedByUsersList.includes(authUserData.Username)) setAuthUserLiked(true)
        else setAuthUserLiked(false)
    }, [likedByUsersList])


    //Creating or Deleting Like
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


    // ----------Bookmark Function------------
    const BookmarkThePost = async () => {
        const bookmarkInfo = { user_username: Username, user_ID: ID, postImage_url: url, postImage_id: id }
        const bookmarkRef = doc(db, 'bookmarks', authUserData.Username)
        const bookmarkResponse = await getDoc(bookmarkRef)
        if (!bookmarkResponse.data()) {
            await setDoc(bookmarkRef, {
                bookmarkArr: [bookmarkInfo]
            })
        }
        else {
            const imagesArr = bookmarkResponse.data().bookmarkArr.map(obj => obj.postImage_id)
            //'remove the bookmarked post' || delete-data
            if (imagesArr.includes(id)) {
                await updateDoc(bookmarkRef, {
                    bookmarkArr: [...bookmarkResponse.data().bookmarkArr.filter(obj => {
                        if (obj.postImage_id !== id) return obj
                    })]
                })
            }
            //'array union || update || bookmark the image'
            else {
                await updateDoc(bookmarkRef, { bookmarkArr: arrayUnion(bookmarkInfo) })
            }
        }
        // const unsub = () => onSnapshot(query(bookmarkRef), async (snapshot) => {
        //     //set new bookmark
        //     if (!snapshot.data()) {
        //         await setDoc(bookmarkRef, {
        //             bookmarkArr: [bookmarkInfo]
        //         })
        //     }
        //     else {
        //         await updateDoc(bookmarkRef, { bookmarkArr: arrayUnion(bookmarkInfo) })
        //     }
        // })
        // unsub()
    }


    // -------------------------------------
    // sending a copy of image data to 'mainDisplayPosts' db
    useEffect(() => {
        if (!id) return
        const Doc = doc(db, "mainDisplayPosts", id)
        updateDoc(Doc, {
            postImage_comment_count: commentsArr.length,
            likedByUsersList
        })
    }, [likesArr, commentsArr, authUserLiked])


    //Getting bookmarks data of auth user
    useEffect(() => {
        if (!authUserData.Username) return
        onSnapshot(query(doc(db, "bookmarks", authUserData.Username)), snapshot => {
            if (!snapshot.data()) return
            const arr = snapshot.data().bookmarkArr
            setBookmarksArr(arr.map(obj => obj.postImage_id))
        })
    }, [db, authUserData.Username])




    return (
        <>
            <div className='SinglePostView' style={{ display: display }} >
                <i className="bi bi-x-lg" onClick={HideIndividualPost}></i>
                <div className="individualPostContainer">
                    <div className="photoPart">
                        <img src={url} alt="uploadedPost" />
                    </div>




                    <div className="commentsPart" >
                        <div className="commentPartHeader">
                            <div id="img">
                                <img src={ProfilePic ? ProfilePic : defaultImage} alt="userProfilePic" />
                            </div>
                            <div id="name">
                                <strong className="SinglePostViewProfileUserName"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        HideIndividualPost()
                                        navigate(`/profile/${Username}`)
                                    }}>{Username ? Username : ""}</strong>
                            </div>
                            <i className="bi bi-three-dots selectDots" style={{
                                display: authUserData?.Username === Username ? "block" : "none"
                            }} onClick={showDeleteOption}></i>
                        </div>


                        {/* -------------------------------- */}
                        <div className="allCommentsArea">
                            {/* -----Caption----- */}
                            {
                                caption ?
                                    <div className="Comment captionHolder">
                                        <div className="cmtImgCntnr">
                                            <img src={ProfilePic ? ProfilePic : defaultImage} alt="userProfilePic" />
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
                                    : <></>
                            }

                            {/* ------------------------- */}
                            {renderComments}
                            {/* ------------------------- */}

                        </div>


                        {/* -------------------------------- */}
                        <div className="commentPartBottom">
                            <div className="postBottomIconsBar">
                                {/* if authUserLiked is true LIKED else NOT */}
                                <i className={`bi ${authUserLiked ? "bi-heart-fill" : "bi-heart"} `}
                                    style={{ color: authUserLiked ? "#ed4956" : "" }}
                                    onClick={AddLikeData}></i>
                                <WhatsappShareButton url={"https://www.instagram.com/"}>
                                    <i className="bi bi-share "></i>
                                </WhatsappShareButton>
                                <i className={`bi ${bookmarkArray.includes(id) ? "bi-bookmark-fill" : "bi-bookmark"}`}
                                    onClick={BookmarkThePost}
                                    style={{ color: bookmarkArray.includes(id) ? "#3A3845" : "" }}></i>
                            </div>
                            <div className="postBottomInfoBlock">
                                <strong id='likesCount'>{likesArr.length} Likes</strong>
                                <small id='daysAgo'>{timestamp ? moment(timestamp).fromNow() : ''}</small>
                            </div>
                            <div className="postBottomAddComment">
                                <i className="bi bi-emoji-smile emoji"></i>
                                <input type="text" id="textArea" placeholder="Add a comment..." ref={commentRef} onChange={handleCommentInput} maxLength={500} />
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
        </>
    )
}

export default React.memo(SinglePostView)