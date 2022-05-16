import "./profile.css"
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { showIndividualPost, chooseImg } from "../../Redux/Feature/individualPostSlice"
import { db, storage } from "../../Database/firebaseConfig"
import { useAuth } from "../../Database/authenticate"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { nanoid } from "@reduxjs/toolkit"
import defaultIMG from "../../Extra/default.jpg"
import Loading from "../Loading/Loading"
import { doc, updateDoc } from "firebase/firestore"
import { useParams } from "react-router-dom"
import { getSpecificUserProfile } from "../../Redux/Feature/userDataFromDbSlice"




function Profile() {

    const dispatch = useDispatch()

    const [progress, setProgress] = useState("")

    const [uploadsList, setUploadsList] = useState([])

    const [profilePicture, setProfilePicture] = useState("")

    const All_Data = useSelector(store => store.firestoreDBReducer.value)

    const selectedUser = useSelector(store => store.selectedUserDataReducer.specificProfileData)

    const { Fullname, Username, All_Images, id, ProfilePic } = useSelector(store => store.selectedUserDataReducer.userData)

    // ---------------------------------

    const user = useAuth()

    const { param } = useParams()

    // ---------------------------------

    const ShowIndividualPost = (e) => {
        dispatch(chooseImg({
            clickedImg: e.target.src,
            All_Images: selectedUser.All_Images ? selectedUser.All_Images : All_Images,
            Username: selectedUser.Username ? selectedUser.Username : Username,
            ProfilePic: selectedUser.ProfilePic ? selectedUser.ProfilePic : ProfilePic,
            ID: selectedUser.id ? selectedUser.id : id,
        }))
        dispatch(showIndividualPost())
        document.querySelector("body").style.overflowY = "hidden"
    }


    useEffect(() => {
        if (param === Username) return
        dispatch(getSpecificUserProfile({ All_Data, selectedUser: param }))
    }, [Username])


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
        const imagesUrl = selectedUser.All_Images ? selectedUser?.All_Images.map(obj => {
            const { url } = obj
            return url
        }) : All_Images?.map(obj => {
            const { url } = obj
            return url
        })
        setUploadsList(imagesUrl)
    }, [All_Images, selectedUser])


    const renderImagesList = () => {
        const imagesList = uploadsList?.map((url) => {
            return (
                <img src={url} alt="profile_image" className="profilePost" onClick={ShowIndividualPost} key={nanoid()} />
            )
        })
        return imagesList?.reverse()
    }


    const renderPosts = useMemo(() => renderImagesList(), [uploadsList])




    return (
        <>
            <div className="ProfileContainer">
                <div className="profileHeader">
                    <div className="profileImageSection">
                        <div className="profileImageContainer">
                            <input type="file" name="profile_upload" id="profile_upload" onChange={(e) => { setProfilePicture(e.target.files[0]) }} style={{ display: user ? "block" : "none" }} />

                            {
                                param === Username ?
                                    <img src={ProfilePic ? ProfilePic : defaultIMG} alt="profile-image" id="profileImage" />
                                    :
                                    <img src={selectedUser.ProfilePic ? selectedUser.ProfilePic : defaultIMG} alt="profile-image" id="profileImage" />
                            }

                            {profilePicture && progress < 100 ? <Loading /> : <></>}
                        </div>
                    </div>
                    <div className="profileInfoSection">
                        <p id="profileName">{param === Username ? Username : selectedUser?.Username}</p>
                        <p id="totalposts"><strong>{uploadsList?.length}</strong> {uploadsList?.length ? "posts" : ""}</p>
                        <strong id="fullname">{param === Username ? Fullname : selectedUser?.Fullname}</strong>
                    </div>
                </div>
                <div className="profileInfoSectionSmaller" >
                    <strong className="fullname_smaller" >{param === Username ? Fullname : selectedUser?.Fullname}</strong>
                    <p className="totalpostsCount"><strong>{uploadsList?.length}</strong> {uploadsList?.length ? "posts" : ""}</p>
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

export default React.memo(Profile)