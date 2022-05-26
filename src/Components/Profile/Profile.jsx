import "./profile.css"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { selectImgObjAsync, showIndividualPost } from "../../Redux/Feature/individualPostSlice"
import { nanoid } from "@reduxjs/toolkit"
import defaultImage from "../../Constant/defaultImage"
import { useParams, useNavigate } from "react-router-dom"
import { getSpecificUserProfile } from "../../Redux/Feature/selectedUserDataSlice"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import InitialLoading from "../InitialLoading/InitialLoading"
import { db } from "../../Database/firebaseConfig"
import { doc, getDoc, setDoc } from "firebase/firestore"




function Profile() {

    const dispatch = useDispatch()

    const [uploadsList, setUploadsList] = useState([])

    const [renderPosts, setRenderPosts] = useState("")

    const All_Data = useSelector(store => store.firestoreDBReducer.value)

    const navVisibility = useSelector(store => store.navbarVisibility.value)

    const selectedUser = useSelector(store => store.selectedUserDataReducer.specificProfileData)

    const { Username, ProfilePic } = useSelector(store => store.selectedUserDataReducer.authUserData)

    // ---------------------------------

    const { param } = useParams()

    const navigate = useNavigate()

    //Redirect To Auth Profile
    useEffect(() => {
        if (param !== Username) return
        navigate(`/profile/${Username}/auth-user`)
    }, [param])

    // ---------------------------------

    const ShowIndividualPost = (e) => {
        dispatch(selectImgObjAsync({
            user_ID: selectedUser.id && selectedUser.id
            , clickedImg: e.target.src
        }))
        dispatch(showIndividualPost())
        document.querySelector("body").style.overflowY = "hidden"
    }


    useEffect(() => {
        dispatch(getSpecificUserProfile({ All_Data, selectedUser: param }))
    }, [All_Data, param])


    // Images Url To Render
    useEffect(() => {
        if (!selectedUser) return
        const imagesUrl =
            selectedUser.All_Images?.map(obj => {
                const { url } = obj
                return url
            })
        setUploadsList(imagesUrl)
    }, [selectedUser, param])


    //Render Images
    useEffect(() => {
        if (uploadsList.length === 0) return
        const imagesList = uploadsList?.map((url) => {
            return (
                <LazyLoadImage src={url} className="profilePost" onClick={ShowIndividualPost} key={nanoid()} />
            )
        }).reverse()
        setRenderPosts(imagesList)
    }, [uploadsList])


    // ----------------------------
    const setMessageUser = () => {
        const sortNames = [Username, selectedUser.Username].sort()

        const sendMessageFunctionality = async () => {
            const messageData = {
                message: `hi!!`,
                sender: Username,
                receiver: selectedUser.Username,
            }
            const msgDocRef = doc(db, "chats", `${sortNames[0]}-${sortNames[1]}Chat`)
            const response = await getDoc(msgDocRef)
            //User is present
            if (response.data()) {
                navigate("/inbox")
            }
            //User not present
            else {
                //User is not present || Create It"
                const ReceiverPic = () => selectedUser.ProfilePic ? selectedUser.ProfilePic : ""
                const SenderPic = () => ProfilePic ? ProfilePic : ""
                setDoc(msgDocRef, {
                    allMessages: [messageData],
                    Receiver: selectedUser.Username,
                    ReceiverPic: ReceiverPic(),
                    Sender: Username,
                    SenderPic: SenderPic()
                })
                navigate("/inbox")
            }
        }
        sendMessageFunctionality()
    }
    // ----------------------------




    return (
        navVisibility ?
            <>
                <div className="ProfileContainer">
                    <div className="profileHeader">
                        <div className="profileImageSection">
                            <div className="profileImageContainer">
                                <img src={selectedUser.ProfilePic ? selectedUser?.ProfilePic : defaultImage} alt="profile-image" id="profileImage" />
                            </div>
                        </div>
                        <div className="profileInfoSection">
                            <div style={{ width: "70%" }}>
                                <p id="profileName">{selectedUser?.Username}</p>

                                {uploadsList ? <p id="totalposts"><strong>{uploadsList?.length}
                                </strong> {" " + "posts"}
                                </p> : <></>}

                                <strong id="fullname">{selectedUser?.Fullname}</strong>
                                {selectedUser.Bio ? <p className="user_bio">{selectedUser.Bio}</p> : <></>}
                            </div>
                            <button className="toMessage" onClick={setMessageUser}>Message</button>
                        </div>
                    </div>
                    {/* -------- */}
                    <div className="profileInfoSectionSmaller" >
                        <strong className="fullname_smaller" >{
                            selectedUser?.Fullname}</strong>
                        {uploadsList ? <p className="totalpostsCount"><strong>{uploadsList?.length}</strong>{" " + 'posts'}</p> : <></>}
                    </div>
                </div>




                <div className="profileAllPostsSection">
                    <div className="section">
                        <i className="bi bi-grid"></i>
                        <p>POSTS</p>
                    </div>
                    {uploadsList && uploadsList?.length !== 0 ?
                        <div className="profilePostsGrid">
                            {renderPosts}
                        </div>
                        :
                        <div className="noPostsYet">
                            <div className="camHolder">
                                <i className="bi bi-camera"></i>
                            </div>
                            <h1>No Posts Yet</h1>
                        </div>}
                </div>
            </>
            : <InitialLoading />
    )
}

export default React.memo(Profile)