import React from 'react'

import "./CreatePost.css"

import { useDispatch, useSelector } from "react-redux"

import { makeUploadOptionsDisappear } from '../../Redux/Feature/uploadPostOptionVisibilitySlice'




function CreatePost() {
    const dispatch = useDispatch()

    const uploadOption = useSelector(store => store.uploadPostOptionVisibilityReducer)

    const hideUploadOptions = () => {
        dispatch(makeUploadOptionsDisappear())
    }


    return (
        <div className='CreatePostParentWrapper' style={{ display: uploadOption.display }}>
            <i className="bi bi-x-lg" onClick={hideUploadOptions}></i>
            <div className="createPostContainer">
                <div id='createPostContainerHeader'><strong>Create new post</strong></div>
                <div id="createPostContainerUploadArea">
                    <div className="someAdditionalWrapper">
                        <i className="bi bi-image"></i>
                        <small>Upload your photos and videos here</small>
                        <button id='uploadBtn'>Select from computer</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost