import "./preview.css"
import React, { useEffect, useState } from 'react'
import defaultImg from "../../Extra/default.jpg"
import { nanoid } from '@reduxjs/toolkit'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../Database/firebaseConfig'
import noPosts from "../../Extra/noposts.png"




function Preview({ uid,
    user_ID,
    hidePreview
}) {

    const [data, setData] = useState({})

    const [All_ImagesPreview, setAll_ImagesPreview] = useState([])


    useEffect(() => {
        const getUserData = async () => {
            const docRef = doc(db, "registeredUsersCredentials", user_ID)
            const response = await getDoc(docRef)
            setData(response.data())
        }
        getUserData()
    }, [user_ID])


    useEffect(() => {
        const Arr = data.All_Images?.map(obj => {
            return obj.url
        }).reverse()?.slice(0, 3)
        setAll_ImagesPreview(Arr)
    }, [data])




    return (
        <>
            <div
                onMouseLeave={hidePreview}
                className="previewHolder"
                id={`PreviewOf${uid}`}
                style={{
                    position: "absolute",
                    top: "50px",
                    left: "65px",
                    display: "none",
                    background: "white",
                    borderRadius: "8px",
                    boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
                    flexDirection: "column",
                    zIndex: "200",
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
                            backgroundImage: `url(${data.ProfilePic ? data.ProfilePic : defaultImg})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            margin: "0 20px"
                        }}></div>
                    <strong>{data?.Username}</strong>
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
                    {data.All_Images?.length} posts
                </div>
                <div className="previewImagesHolder"
                    style={{
                        flexGrow: "1",
                        borderBottom: "1px solid lightgray",
                        display: All_ImagesPreview && All_ImagesPreview?.length !== 0 ? "grid" : "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    {
                        All_ImagesPreview && All_ImagesPreview?.length !== 0 ? All_ImagesPreview?.map(url => {
                            return (
                                <img src={url} alt="previewPost"
                                    style={{
                                        width: "100%",
                                        height: "75%",
                                        objectFit: "cover"
                                    }}
                                    key={nanoid()} />
                            )
                        }) : <img style={{
                            width: "100%",
                            height: "100%"
                        }}
                            src={noPosts}
                            alt="noPosts"
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default React.memo(Preview)