import "./Posts.css"
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { selectImgObjAsync, showIndividualPost } from "../../Redux/Feature/individualPostSlice"
import defaultImage from "../../Constant/defaultImage"
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../../Database/firebaseConfig"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import {
    WhatsappShareButton
} from "react-share";
import Preview from "../Preview/Preview"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ReelsHolder from "../ReelsHolder/ReelsHolder"
import InitialLoading from "../InitialLoading/InitialLoading"
import { nanoid } from "@reduxjs/toolkit"




function Posts() {

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [postsArr, setPostsArr] = useState([])

    const [comment, setComment] = useState(null)

    const [demo, setDemo] = useState(0)

    const [renderPosts_Images, setRenderPosts_Images] = useState(null)

    const navVisibility = useSelector(store => store.navbarVisibility.value)

    const { Username, ProfilePic, id } =
        useSelector(store =>
            store.selectedUserDataReducer.authUserData)
    // -----------------------------


    useEffect(() => {
        const getPostData = async () => {
            onSnapshot(query(collection(db, "mainDisplayPosts"),
                orderBy('timestamp', 'desc')), snapshot => {
                    setPostsArr(snapshot.docs)
                })
        }
        getPostData()
    }, [db])



    useEffect(() => {
        const arr = postsArr?.map((elem) => {
            const { user_username, user_ID,
                user_proPic, postImage_comment_count,
                postImage_id,
                postImage_url,
                postImage_caption,
                postImage_publishTime,
                likedByUsersList } = elem.data()

            const publishTime = new Date(postImage_publishTime)

            const ShowIndividualPost = () => {
                dispatch(selectImgObjAsync({ user_ID, clickedImg: postImage_url }))
                dispatch(showIndividualPost())
                document.querySelector("body").style.overflowY = "hidden"
            }

            // --------------------------
            const BookmarkThePost = async () => {
                const bookmarkInfo = { user_username, user_ID, postImage_url, postImage_id }
                const bookmarkRef = doc(db, 'bookmarks', user_username)
                const BookDoc = await getDoc(bookmarkRef)
                if (!BookDoc.data()) await setDoc(bookmarkRef, {
                    bookmarkArr: [bookmarkInfo]
                })
                else await updateDoc(bookmarkRef, { bookmarkArr: arrayUnion(bookmarkInfo) })
            }

            // --------------------------
            const AddLikeData = async () => {
                const docRef = doc(db, "registeredUsersCredentials", user_ID, `LikesFor${postImage_id}`, Username)
                const collRef = collection(db, "registeredUsersCredentials", user_ID, `LikesFor${postImage_id}`)
                const DocRes = await getDoc(docRef)
                if (DocRes.data()) await deleteDoc(docRef)
                else await setDoc(docRef, {
                    authUser: Username
                })

                // sending a copy of image data to 'mainDisplayPosts' db
                onSnapshot(query(collRef), snapshot => {
                    const likedByUsersList = snapshot.docs.map(document => document.id)
                    const post_ref = doc(db, "mainDisplayPosts", postImage_id)
                    updateDoc(post_ref, { likedByUsersList })
                })

                setDemo(nanoid())
            }

            // --------------------------
            const takeToProfile = () => {
                navigate(`/profile/${user_username}`)
            }

            // --------------------------
            const AddCommentPost = async (e) => {
                if (!comment) return

                e.target.previousSibling.value = ""
                const docRef = collection(db, "registeredUsersCredentials", user_ID, `CommentsFor${postImage_id}`)
                await addDoc(docRef, {
                    comment: comment,
                    comentedUsername: Username,
                    comentedUserProfilePic: ProfilePic ? ProfilePic : "",
                    commentedUserId: id,
                    timestamp: serverTimestamp()
                })
                setComment(null)

                // sending a copy of image data to 'mainDisplayPosts' db
                onSnapshot(query(docRef), snapshot => {
                    const count = snapshot.docs.length
                    const post_ref = doc(db, "mainDisplayPosts", postImage_id)
                    updateDoc(post_ref, { postImage_comment_count: count })
                })
            }

            // --------------------------
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
                        {/* ----------------------- */}
                        <div className="postBottomIconsBar">
                            <i className={`bi ${likedByUsersList.includes(Username) ? "bi-heart-fill" : "bi-heart Heart"} `}
                                style={{ color: likedByUsersList.includes(Username) ? "#ed4956" : "" }}
                                onClick={AddLikeData}
                            ></i>
                            <WhatsappShareButton url={"https://www.instagram.com/"}>
                                <i className="bi bi-share "></i>
                            </WhatsappShareButton>
                            <i className="bi bi-bookmark " onClick={BookmarkThePost}></i>
                        </div>
                        {/* ----------------------- */}

                        <div className="postBottomInfoBlock">
                            {likedByUsersList.length !== 0 ? <strong id='likesCount'>{likedByUsersList.length}</strong> : ""}
                            <p className="postCaption"><strong>{user_username}</strong> {postImage_caption}</p>
                            {postImage_comment_count ? <p className="viewAllComments" onClick={ShowIndividualPost}>View All {postImage_comment_count} Comments</p> : ""}
                            <small id='daysAgo'>{moment(publishTime).fromNow()}</small>
                        </div>

                        <div className="postBottomAddComment">
                            <i className="bi bi-emoji-smile emoji"></i>
                            <input type="text" id="textArea" placeholder="Add a comment..."
                                onChange={handleCommentInput} maxLength={500} />
                            <span className="postOption" onClick={AddCommentPost}
                                style={{ opacity: comment ? "1" : "0.6" }}
                            >Post</span>
                        </div>
                    </div>
                </div>
            )
        })
        setRenderPosts_Images(arr)
    }, [postsArr, comment, demo])




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