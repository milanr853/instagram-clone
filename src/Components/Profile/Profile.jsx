import "./profile.css"

import React from 'react'

import bg from "../../Extra/bg2.jpg"
import { useDispatch, useSelector } from "react-redux"
import { showIndividualPost } from "../../Redux/Feature/individualPostSlice"



function Profile() {
    const dispatch = useDispatch()

    const { Fullname, Username } = useSelector(store => store.selectedUserDataReducer.userData)




    const ShowIndividualPost = () => {
        dispatch(showIndividualPost())
        document.querySelector("body").style.overflowY = "hidden"
    }


    return (
        <>
            <div className="ProfileContainer">
                <div className="profileHeader">
                    <div className="profileImageSection">
                        <div className="profileImageContainer">
                            <img src={"https://bityl.co/C1cV"} alt="profile-image" id="profileImage" />
                        </div>
                    </div>
                    <div className="profileInfoSection">
                        <p id="profileName">{Username}</p>
                        <p id="totalposts"><strong>0</strong> posts</p>
                        <strong id="fullname">{Fullname}</strong>
                    </div>
                </div>
                <div className="profileInfoSectionSmaller" >
                    <strong className="fullname_smaller" >Full Name</strong>
                    <p className="totalpostsCount"><strong>0</strong> posts</p>
                </div>
            </div>

            <div className="profileAllPostsSection">
                <div className="section">
                    <i className="bi bi-grid"></i>
                    <p>POSTS</p>
                </div>
                {1 > 0 ?
                    <div className="profilePostsGrid">
                        <img src={bg} alt="profile_image" className="profilePost" onClick={ShowIndividualPost} />
                        <img src={bg} alt="profile_image" className="profilePost" onClick={ShowIndividualPost} />
                        <img src={bg} alt="profile_image" className="profilePost" onClick={ShowIndividualPost} />
                        <img src={bg} alt="profile_image" className="profilePost" onClick={ShowIndividualPost} />
                        <img src={bg} alt="profile_image" className="profilePost" onClick={ShowIndividualPost} />
                        <img src={bg} alt="profile_image" className="profilePost" onClick={ShowIndividualPost} />
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