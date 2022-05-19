import "./Posts.css"
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { selectImgObjAsync, showIndividualPost } from "../../Redux/Feature/individualPostSlice"
import defaultImage from "../../Constant/defaultImage"
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore"
import { db } from "../../Database/firebaseConfig"
import moment from "moment"
import { collectIDs } from "../../Redux/Feature/likePostSlice"
import { useNavigate } from "react-router-dom"
import {
    WhatsappShareButton
} from "react-share";
import Preview from "../Preview/Preview"
import { setTimelinePosts } from "../../Redux/Feature/timelinePostsSlice"
import { nanoid } from "@reduxjs/toolkit"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ReelsHolder from "../ReelsHolder/ReelsHolder"
import InitialLoading from "../InitialLoading/InitialLoading"




function Posts() {

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [postsArr, setPostsArr] = useState([])

    const [comment, setComment] = useState(null)

    const [renderPosts_Images, setRenderPosts_Images] = useState(null)

    const navVisibility = useSelector(store => store.navbarVisibility.value)

    // -----------------------------



    useEffect(() => {
        const getAllLikes = async () => {
            onSnapshot(query(collection(db, "mainDisplayPosts"),
                orderBy('timestamp', 'desc')), snapshot => {
                    setPostsArr(snapshot.docs)
                    // dispatch(setTimelinePosts(nanoid()))
                })
        }
        getAllLikes()
    }, [db])




    useEffect(() => {
        const arr = postsArr?.map((elem) => {
            const { user_username, user_ID,
                user_proPic, postImage_comment_count,
                postImage_id,
                postImage_url,
                postImage_caption,
                postImage_publishTime,
                authUserClicked, postImage_like_count } = elem.data()

            const publishTime = new Date(postImage_publishTime)

            const ShowIndividualPost = () => {
                dispatch(selectImgObjAsync({ user_ID, clickedImg: postImage_url }))
                dispatch(showIndividualPost())
                document.querySelector("body").style.overflowY = "hidden"
            }

            const AddLikeData = () => {
                dispatch(collectIDs({ UserID: user_ID, ImageID: postImage_id, authLike: authUserClicked }))
            }

            const takeToProfile = () => {
                navigate(`/profile/${user_username}`)
            }

            const AddCommentPost = async (e) => {
                if (!comment) return

                e.target.previousSibling.value = ""

                const docRef = collection(db, "registeredUsersCredentials", user_ID, `CommentsFor${postImage_id}`)

                await addDoc(docRef, {
                    comment: comment,
                    comentedUsername: user_username,
                    comentedProfilePic: user_proPic ? user_proPic : "",
                    commentedUserId: user_ID,
                    timestamp: serverTimestamp()
                })
                setComment(null)
            }

            const hidePreview = (e) => {
                const userPreview = document.querySelector(`#PreviewOf${postImage_id}`)
                userPreview.style.display = "none"
            }

            const showPreview = (e) => {
                const userPreview = document.querySelector(`#PreviewOf${postImage_id}`)
                userPreview.style.display = "flex"
            }

            const handleCommentInput = (e) => setComment(e.target.value.trim())




            return (
                <div className="PostContainer" key={postImage_id}>
                    <div className="postHeader" onMouseLeave={hidePreview}>
                        <div className="userImageContainer">
                            <img src={user_proPic ? user_proPic : defaultImage} alt="userImage" className="userImage"
                            />
                        </div>
                        <h4 className="postUserName" onClick={takeToProfile}
                            onMouseEnter={showPreview}
                        >{user_username}</h4>
                        {/* -------------------- */}
                        <Preview user_ID={user_ID} uid={postImage_id} hidePreview={hidePreview} />
                        {/* -------------------- */}
                    </div>

                    <LazyLoadImage effect="blur" width="100%"
                        className="postImage" id={postImage_id} src={postImage_url} alt="postImage"
                        style={{ cursor: "pointer" }}
                        onClick={ShowIndividualPost} />

                    <div className="postBottom">
                        <div className="postBottomIconsBar">
                            <i className={`bi ${authUserClicked ? "bi-heart-fill" : "bi-heart Heart"} `}
                                style={{ color: authUserClicked ? "#ed4956" : "" }}
                                onClick={AddLikeData}
                            ></i>
                            <WhatsappShareButton url={"https://www.instagram.com/"}>
                                <i className="bi bi-share "></i>
                            </WhatsappShareButton>
                            <i className="bi bi-bookmark "></i>
                        </div>
                        <div className="postBottomInfoBlock">
                            {postImage_like_count ? <strong id='likesCount'>{postImage_like_count}</strong> : ""}
                            <p className="postCaption"><strong>{user_username}</strong> {postImage_caption}</p>
                            {postImage_comment_count ? <p className="viewAllComments" onClick={ShowIndividualPost}>View All {postImage_comment_count} Comments</p> : ""}
                            <small id='daysAgo'>{moment(publishTime).fromNow()}</small>
                        </div>
                        <div className="postBottomAddComment">
                            <i className="bi bi-emoji-smile emoji"></i>
                            <input type="text" id="textArea" placeholder="Add a comment..."
                                onChange={handleCommentInput} />
                            <span className="postOption" onClick={AddCommentPost}
                                style={{ opacity: comment ? "1" : "0.6" }}
                            >Post</span>
                        </div>
                    </div>
                </div>
            )
        })
        setRenderPosts_Images(arr)
    }, [postsArr, comment])




    return (
        navVisibility ?
            <>
                <ReelsHolder />
                {renderPosts_Images}
            </>
            : <InitialLoading />
    )
}

export default Posts