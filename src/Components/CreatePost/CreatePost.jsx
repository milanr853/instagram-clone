import "./CreatePost.css"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { makeUploadOptionsDisappear } from '../../Redux/Feature/uploadPostOptionVisibilitySlice'
import { db, storage } from "../../Database/firebaseConfig"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { nanoid } from '@reduxjs/toolkit'
import { arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore"




function CreatePost() {

    const dispatch = useDispatch()

    const { Username, id } = useSelector(store => store.selectedUserDataReducer.userData)

    const textAreaRef = useRef()

    const [file, setFile] = useState(null)

    const [progress, setProgress] = useState(null)

    const [currentPicLink, setCurrentPicLink] = useState(null)

    const [captionAreaVisibility, setCaptionAreaVisibility] = useState(false)

    const [caption, setCaption] = useState(null)

    const [preview, setPreview] = useState(null)

    const [progressDisplay, setProgressDisplay] = useState(false)

    const uploadOption = useSelector(store => store.uploadPostOptionVisibilityReducer)


    //Set States To Default
    const hideUploadOptions = () => {
        dispatch(makeUploadOptionsDisappear())
        document.querySelector("body").style.overflowY = "scroll"
        setFile(null)
        setProgress(null)
        setCurrentPicLink(null)
        setCaptionAreaVisibility(false)
        setCaption(null)
        setPreview(null)
        setProgressDisplay(false)
    }


    //Image Preview Feature
    useEffect(() => {
        const generatePreview = async () => {
            if (!file) return
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                setPreview(reader.result)
            }
        }
        generatePreview()
    }, [file])


    //Upload Post Function
    const uploadPost = async (e) => {
        try {
            setProgressDisplay(true)
            const imageRef = ref(storage, `${Username}/uploads/${file.name + nanoid()}`)
            const uploadTask = uploadBytesResumable(imageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(prog)
                },
                (error) => {
                    // Handle unsuccessful uploads
                },
                async () => {
                    await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setCurrentPicLink(downloadURL)
                        setFile(null)
                    });
                }
            );
        }
        catch (err) { console.log(err.message) }
    }


    useEffect(() => {
        if (!currentPicLink) return
        const date = new Date().toString()

        const imageData = {
            id: nanoid(),
            url: currentPicLink,
            like_count: 0,
            caption: caption,
            timestamp: date
        }

        const docRef = doc(db, 'registeredUsersCredentials', id)
        updateDoc(docRef, {
            All_Images: arrayUnion(imageData)
        })
        textAreaRef.current.value = ""

    }, [currentPicLink])




    return (
        <div className='CreatePostParentWrapper' style={{ display: uploadOption.display }}>
            <i className="bi bi-x-lg" onClick={hideUploadOptions}></i>
            <div className="createPostContainer">
                {/* Header */}
                <div id='createPostContainerHeader'>
                    <strong>Create new post</strong>

                    <p style={{
                        display: `${preview ? "block" : "none"}`,
                        textDecoration: "underline",
                        color: "dodgerblue",
                        cursor: "pointer",
                        fontSize: "16px",
                        position: "absolute",
                        right: "15px"
                    }}
                        onClick={() => {
                            setCaptionAreaVisibility("flex")
                            setPreview(null)
                        }}>Next</p>
                </div>


                {
                    !captionAreaVisibility ?
                        <>
                            <div id="createPostContainerUploadArea" >

                                <div className="someAdditionalWrapper" style={{
                                    height: preview ? "100%" : "250px",
                                    width: preview ? "100%" : "300px",
                                }}>
                                    <div style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        {preview ?
                                            <div style={{
                                                width: "100%",
                                                height: "100%",
                                                backgroundImage: `url(${preview})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center"
                                            }}></div>
                                            : <i className="bi bi-image"></i>
                                        }
                                    </div>

                                    <small style={{ display: preview ? "none" : "block" }}>Upload your photos and videos here</small>

                                    <div style={{
                                        position: 'relative',
                                        height: "70px",
                                        width: "100%",
                                        display: preview ? "none" : "flex",
                                        justifyContent: "center",
                                        alignItems: "flex-end"
                                    }}>
                                        <label htmlFor="file" id='uploadBtn'
                                            style={{ display: `${preview ? "none" : "flex"}` }}>Select from computer</label>
                                        <input type="file" name="file" id="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                setFile(e.target.files[0])
                                            }} />
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div id="createPostContainerCaptionArea" style={{ display: progress === 100 ? "none" : 'flex' }}>
                                {/* Progress Bar */}
                                <textarea name="captionArea" id="captionArea" placeholder='Add a caption'
                                    onChange={() => setCaption(textAreaRef.current.value.trim())} ref={textAreaRef}></textarea>
                                <button className="post" onClick={uploadPost}>Post</button>
                                <div style={{
                                    width: "100%",
                                    height: "100%",
                                    background: "white",
                                    position: "absolute",
                                    opacity: "0.4",
                                    display: progressDisplay ? "block" : "none"
                                }}>
                                    <p className='progressPercent' >Uploaded:{Math.round(progress)}%</p>
                                </div>
                            </div>
                            {/* ------------------------------- */}
                            <div style={{
                                width: "100%",
                                height: "100%",
                                display: progress === 100 ? "flex" : "none",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <p style={{
                                    fontSize: "30px"
                                }}>Post Uploaded</p>
                            </div>
                        </>
                }

            </div>
        </div>
    )
}

export default React.memo(CreatePost)