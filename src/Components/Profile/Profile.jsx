import "./profile.css"

import React, { useEffect, useMemo, useState } from 'react'

import bg from "../../Extra/bg2.jpg"
import { useDispatch, useSelector } from "react-redux"
import { showIndividualPost } from "../../Redux/Feature/individualPostSlice"
import { db, storage } from "../../Database/firebaseConfig"
import { useAuth } from "../../Database/authenticate"
import { getDownloadURL, listAll, ref, uploadBytesResumable } from "firebase/storage"
import { nanoid } from "@reduxjs/toolkit"

import defaultIMG from "../../Extra/default.jpg"
import Loading from "../Loading/Loading"
import { doc, updateDoc } from "firebase/firestore"


function Profile() {
    const dispatch = useDispatch()

    const [profilePicture, setProfilePicture] = useState("")

    const [progress, setProgress] = useState("")

    const [uploadsList, setUploadsList] = useState([])

    const { Fullname, Username, All_Images, id, ProfilePic } = useSelector(store => store.selectedUserDataReducer.userData)

    // ---------------------------------

    const user = useAuth()

    // ---------------------------------
    const ShowIndividualPost = () => {
        dispatch(showIndividualPost())
        document.querySelector("body").style.overflowY = "hidden"
    }



    // Profile Picture Upload To Firebase Storage
    useEffect(() => {
        const uploadPost = async () => {
            if (!profilePicture) return
            if (profilePicture) {
                try {
                    const imageRef = ref(storage, `${Username}/profile/${profilePicture.name + nanoid()}`)
                    const uploadTask = uploadBytesResumable(imageRef, profilePicture);

                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setProgress(prog)
                        },
                        (error) => {
                            // Handle unsuccessful uploads
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                const ProfilePic = { ProfilePic: downloadURL }
                                const docRef = doc(db, 'registeredUsersCredentials', id)
                                updateDoc(docRef,
                                    ProfilePic
                                )
                            });
                        }
                    );
                }
                catch (err) { console.log(err.message) }
            }
        }
        uploadPost()
    }, [profilePicture])


    // Images Url To Render
    useEffect(() => {
        const imagesUrl = All_Images?.map(obj => {
            const { url } = obj
            return url
        })
        setUploadsList(imagesUrl)
    }, [All_Images])


    const renderImagesList = () => {
        const imagesList = uploadsList?.map((url) => {
            return (
                <img src={url} alt="profile_image" className="profilePost" onClick={ShowIndividualPost} key={nanoid()} />
            )
        })
        return imagesList
    }

    const renderPosts = useMemo(() => renderImagesList(), [All_Images])



    return (
        <>
            <div className="ProfileContainer">
                <div className="profileHeader">
                    <div className="profileImageSection">
                        <div className="profileImageContainer">
                            <input type="file" name="profile_upload" id="profile_upload" onChange={(e) => { setProfilePicture(e.target.files[0]) }} style={{ display: user ? "block" : "none" }} />
                            <img src={ProfilePic ? ProfilePic : defaultIMG} alt="profile-image" id="profileImage" />
                            {profilePicture && progress < 100 ? <Loading /> : <></>}
                        </div>
                    </div>
                    <div className="profileInfoSection">
                        <p id="profileName">{Username}</p>
                        <p id="totalposts"><strong>{uploadsList?.length}</strong> posts</p>
                        <strong id="fullname">{Fullname}</strong>
                    </div>
                </div>
                <div className="profileInfoSectionSmaller" >
                    <strong className="fullname_smaller" >Full Name</strong>
                    <p className="totalpostsCount"><strong>{uploadsList?.length}</strong> posts</p>
                </div>
            </div>

            <div className="profileAllPostsSection">
                <div className="section">
                    <i className="bi bi-grid"></i>
                    <p>POSTS</p>
                </div>
                {uploadsList?.length !== 0 ?
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
    )
}

export default Profile