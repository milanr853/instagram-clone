import "./profile.css"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { selectImgObjAsync, showIndividualPost } from "../../Redux/Feature/individualPostSlice"
import { db, storage } from "../../Database/firebaseConfig"
import { useAuth } from "../../Database/authenticate"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { nanoid } from "@reduxjs/toolkit"
import defaultImage from "../../Constant/defaultImage"
import Loading from "../Loading/Loading"
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { useParams } from "react-router-dom"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import InitialLoading from "../InitialLoading/InitialLoading"




function AuthProfile() {

    const dispatch = useDispatch()

    const [progress, setProgress] = useState("")

    const [uploadsList, setUploadsList] = useState([])

    const [renderPosts, setRenderPosts] = useState("")

    const [profilePicture, setProfilePicture] = useState("")

    const navVisibility = useSelector(store => store.navbarVisibility.value)

    //Auth User [Data]
    const { Fullname, Username, All_Images, id, ProfilePic, Bio } = useSelector(store => store.selectedUserDataReducer.authUserData)

    // ---------------------------------

    const user = useAuth()

    // const { param } = useParams()

    // ---------------------------------

    const ShowIndividualPost = (e) => {
        dispatch(selectImgObjAsync({
            user_ID: id
            , clickedImg: e.target.src
        }))
        dispatch(showIndividualPost())
        document.querySelector("body").style.overflowY = "hidden"
    }


    // Profile Picture Upload To Firebase Storage
    useEffect(() => {
        if (!profilePicture) return
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
                                // -------------------
                                const reelRef = doc(db, "reels", Username)
                                getDoc(reelRef).then(reel_res =>
                                    reel_res.data()
                                        ?
                                        updateDoc(reelRef, { user_proPic: downloadURL })
                                        :
                                        null
                                )
                                // -------------------
                                const postsRef = collection(db, "mainDisplayPosts")
                                getDocs(postsRef).then(DocsRef =>
                                    DocsRef.docs.forEach(
                                        document =>
                                            document.data().user_username === Username ?
                                                updateDoc(doc(db, "mainDisplayPosts", document.id), { user_proPic: downloadURL })
                                                :
                                                null)
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
        if (!All_Images) return
        const imagesUrl =
            All_Images?.map(obj => {
                const { url } = obj
                return url
            })

        setUploadsList(imagesUrl)
    }, [All_Images])


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




    return (
        navVisibility ?
            <>
                <div className="ProfileContainer">

                    <div className="profileHeader">
                        <div className="profileImageSection">
                            <div className="profileImageContainer">
                                <input type="file" name="profile_upload" id="profile_upload"
                                    onChange={(e) => { setProfilePicture(e.target.files[0]) }}
                                    style={{ display: user ? "block" : "none" }} />
                                <img src={ProfilePic ? ProfilePic : defaultImage} alt="profile-image" id="profileImage" />
                                {profilePicture && progress < 100 ? <Loading /> : <></>}
                            </div>
                        </div>
                        <div className="profileInfoSection profileInfoSectionAuth">
                            <div>
                                <p id="profileName">{Username}</p>
                                <p id="totalposts"><strong>{uploadsList?.length}</strong> {"posts"}</p>
                                <strong id="fullname">{Fullname}</strong>
                                {Bio ? <p className="user_bio">{Bio}</p> : <></>}
                            </div>
                        </div>
                    </div>

                    <div className="profileInfoSectionSmaller" >
                        <strong className="fullname_smaller" >{
                            Fullname
                        }</strong>
                        <p className="totalpostsCount"><strong>{uploadsList?.length}</strong> {"posts"}</p>
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
            : <InitialLoading />
    )
}

export default React.memo(AuthProfile)