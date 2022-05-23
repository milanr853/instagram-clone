import "./CreatePost.css"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { makeUploadOptionsDisappear } from '../../Redux/Feature/uploadPostOptionVisibilitySlice'
import { db, storage } from "../../Database/firebaseConfig"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { nanoid } from '@reduxjs/toolkit'
import { setDoc, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import futureTime from "../../Constant/setTime"




function CreatePost() {

    const dispatch = useDispatch()

    const [file, setFile] = useState(null)

    const [preview, setPreview] = useState(null)

    const [caption, setCaption] = useState(null)

    const [progress, setProgress] = useState(null)

    const [currentPicLink, setCurrentPicLink] = useState(null)

    const [progressDisplay, setProgressDisplay] = useState(false)

    const [captionAreaVisibility, setCaptionAreaVisibility] = useState(false)

    const { Username, id, ProfilePic } =
        useSelector(store => store.selectedUserDataReducer.authUserData)

    const uploadOption =
        useSelector(store => store.uploadPostOptionVisibilityReducer)


    // --------------------------------
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
        const databaseOperations = async () => {
            if (!currentPicLink) return
            const date = new Date().toString()


            const img_id = nanoid()

            const Caption = () => caption.trim()

            const imageData = {
                id: img_id,
                url: currentPicLink,
                caption: Caption(),
                timestamp: date
            }


            //Firestore Update User Document in registeredUsersCredentials collection
            const docRef = doc(db, 'registeredUsersCredentials', id)
            updateDoc(docRef, {
                All_Images: arrayUnion(imageData)
            })


            //Firestore Create Document in mainDisplayPosts collection
            try {
                const mainDisplayPostsRef = doc(db, "mainDisplayPosts", img_id)
                setDoc(mainDisplayPostsRef, {
                    user_username: Username,
                    user_ID: id,
                    user_proPic: ProfilePic ? ProfilePic : "",
                    postImage_id: img_id,
                    postImage_url: currentPicLink,
                    postImage_caption: Caption(),
                    postImage_publishTime: date,
                    authUserClicked: false,
                    postImage_comment_count: 0,
                    postImage_like_count: 0,
                    bookmark: false,
                    timestamp: serverTimestamp(),
                })
            }
            catch (error) {
                console.log(error)
            }


            // Firestore Create Document in reels collection
            try {
                const reelRef = doc(db, "reels", Username)
                setDoc(reelRef, {
                    user_username: Username,
                    user_ID: id,
                    user_proPic: ProfilePic ? ProfilePic : "",
                    postImage_id: img_id,
                    postImage_url: currentPicLink,
                    timestamp: serverTimestamp(),
                    postImage_publishTime: date,
                    futureTime: futureTime(date)
                })
            }
            catch (error) {
                console.log(error)
            }
        }
        databaseOperations()
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
                                    onChange={(e) => setCaption(e.target.value)} maxLength={500}></textarea>
                                <button className="post" onClick={uploadPost}>Post</button>
                                <div style={{
                                    width: "100%",
                                    height: "100%",
                                    background: "white",
                                    position: "absolute",
                                    borderRadius: "4px",
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