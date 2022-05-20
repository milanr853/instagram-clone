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




function Profile() {

    const dispatch = useDispatch()

    const [uploadsList, setUploadsList] = useState([])

    const [renderPosts, setRenderPosts] = useState("")

    const All_Data = useSelector(store => store.firestoreDBReducer.value)

    const navVisibility = useSelector(store => store.navbarVisibility.value)

    const selectedUser = useSelector(store => store.selectedUserDataReducer.specificProfileData)

    const { Username } = useSelector(store => store.selectedUserDataReducer.authUserData)

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
                                <img src={selectedUser.ProfilePic ? selectedUser?.ProfilePic : defaultImage} alt="profile-image" id="profileImage" />
                            </div>
                        </div>
                        <div className="profileInfoSection">
                            <p id="profileName">{
                                selectedUser?.Username}</p>
                            <p id="totalposts"><strong>{uploadsList?.length}</strong> {uploadsList?.length ? "posts" : ""}</p>
                            <strong id="fullname">{
                                selectedUser?.Fullname}</strong>
                        </div>
                    </div>
                    <div className="profileInfoSectionSmaller" >
                        <strong className="fullname_smaller" >{
                            selectedUser?.Fullname}</strong>
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
            : <InitialLoading />
    )
}

export default React.memo(Profile)