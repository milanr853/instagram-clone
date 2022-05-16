import "./Posts.css"
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { chooseImg, showIndividualPost } from "../../Redux/Feature/individualPostSlice"
import defaultImg from "../../Extra/default.jpg"
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore"
import { db } from "../../Database/firebaseConfig"
import moment from "moment"
import { collectIDs } from "../../Redux/Feature/likePostSlice"
import { useNavigate } from "react-router-dom"
import {
    WhatsappShareButton
} from "react-share";




function Posts() {

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [postsArr, setPostsArr] = useState()

    const [comment, setComment] = useState(null)

    const { All_Images } = useSelector(store => store.selectedUserDataReducer.userData)


    // -----------------------------
    useEffect(() => {
        const getAllLikes = async () => {
            onSnapshot(query(collection(db, "mainDisplayPosts"),
                orderBy('timestamp', 'desc')), snapshot => setPostsArr(snapshot.docs))
        }
        getAllLikes()
    }, [db])




    const renderPosts_Images =
        postsArr?.map((elem) => {
            const { user_username, user_ID,
                user_proPic, postImage_comment_count,
                postImage_id, postImage_url,
                postImage_caption,
                postImage_publishTime,
                authUserClicked, postImage_like_count,
                PostsCount, All_ImagesPreview } = elem.data()

            const publishTime = new Date(postImage_publishTime)

            const ShowIndividualPost = () => {
                dispatch(chooseImg({
                    clickedImg: postImage_url,
                    All_Images: All_Images,
                    Username: user_username,
                    ProfilePic: user_proPic,
                    ID: user_ID,
                }))
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


            return (
                <div className="PostContainer" key={postImage_id}>
                    <div className="postHeader">
                        <div className="userImageContainer">
                            <img src={user_proPic ? user_proPic : defaultImg} alt="userImage" className="userImage" onClick={takeToProfile}
                            />
                        </div>
                        <h4 className="postUserName" onClick={takeToProfile}
                            onMouseEnter={showPreview}
                            onMouseLeave={hidePreview}
                        >{user_username}</h4>
                        {/* -------------------- */}
                        <div
                            id={`PreviewOf${postImage_id}`}
                            style={{
                                position: "absolute",
                                top: "50px",
                                left: "65px",
                                display: "none",
                                height: "350px",
                                width: "400px",
                                background: "white",
                                borderRadius: "8px",
                                boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
                                // display: "flex",
                                flexDirection: "column"
                            }}>
                            <div className="previewHeader"
                                style={{
                                    width: "100%",
                                    height: "100px",
                                    borderBottom: "1px solid lightgray",
                                    display: "flex",
                                    alignItems: "center"
                                }}>
                                <div className="userImagePreview"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        backgroundImage: `url(${user_proPic ? user_proPic : defaultImg})`,
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        margin: "0 20px"
                                    }}></div>
                                <strong>{user_username}</strong>
                            </div>
                            <div className="previewBottom"
                                style={{
                                    width: "100%",
                                    height: "75px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderBottom: "1px solid lightgray"
                                }}>
                                {PostsCount} posts
                            </div>
                            <div className="previewImagesHolder"
                                style={{
                                    flexGrow: "1",
                                    borderBottom: "1px solid lightgray",
                                    display: All_ImagesPreview && All_ImagesPreview.length !== 0 ? "grid" : "flex",
                                    gridTemplateColumns: "repeat(3,1fr)",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                {
                                    All_ImagesPreview && All_ImagesPreview.length !== 0 ? All_ImagesPreview?.map(obj => {
                                        return (
                                            <img src={obj.url} alt="previewPost"
                                                style={{
                                                    width: "100%",
                                                    height: "75%",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        )
                                    }) : <p style={{ color: "gray" }}>No Posts Yet</p>
                                }
                            </div>
                        </div>
                        {/* -------------------- */}
                    </div>
                    <img className="postImage" id={postImage_id} src={postImage_url} alt="postImage"
                        style={{ cursor: "pointer" }}
                        onClick={ShowIndividualPost} />
                    <div className="postBottom">
                        <div className="postBottomIconsBar">
                            <i className={`bi ${authUserClicked ? "bi-heart-fill" : "bi-heart"} `}
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
                                onChange={(e) => { setComment(e.target.value.trim()) }} />
                            <span className="postOption" onClick={AddCommentPost}
                                style={{ opacity: comment ? "1" : "0.6" }}
                            >Post</span>
                        </div>
                    </div>
                </div>
            )
        })




    return (
        <>
            {renderPosts_Images}
        </>
    )
}

export default Posts