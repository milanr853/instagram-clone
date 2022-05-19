import "./styles.css"
import React, { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../../Database/firebaseConfig"
import { useDispatch } from "react-redux"
import { selectImgObjAsync, showIndividualPost } from "../../Redux/Feature/individualPostSlice"




function ReelsHolder() {
    const dispatch = useDispatch()

    const [reelsArr, setReelsArr] = useState([])

    const [renderReels, setRenderReels] = useState([])




    // ------------------------------
    useEffect(() => {
        const getReelsData = async () => {
            onSnapshot(query(collection(db, "reels"),
                orderBy('timestamp', 'desc')), snapshot => {
                    setReelsArr(snapshot.docs)
                    // dispatch(setTimelinePosts(nanoid()))
                })
        }
        getReelsData()
    }, [db])


    useEffect(() => {
        const arr = reelsArr.map(obj => {
            const {
                futureTime,
                postImage_url,
                user_ID,
                user_proPic,
                user_username
            } = obj.data()


            const checkTimeAndDeleteReel = () => {
                const FutureTime = new Date(futureTime).getTime()
                const Now = new Date().getTime()
                const gap = FutureTime - Now

                const second = 1000
                const minute = second * 60
                const TimeLeft = (gap / minute)

                if (TimeLeft === 0 || TimeLeft < 0) {
                    const docRef = doc(db, "reels", user_username)
                    deleteDoc(docRef)
                }
            }
            checkTimeAndDeleteReel()



            const reelView = () => {
                dispatch(selectImgObjAsync({ user_ID, clickedImg: postImage_url }))
                dispatch(showIndividualPost())
                document.querySelector("body").style.overflowY = "hidden"
            }



            return (
                <div className="singleReel" key={user_ID}
                    style={{
                        backgroundPosition: "bottom",
                        backgroundSize: "cover",
                        backgroundImage: `url(https://bityl.co/CFyc)`,
                    }}>
                    <img className="reelProfileImage" src={`${user_proPic}`} onClick={reelView} />
                </div>
            )
        })
        setRenderReels(arr)
    }, [reelsArr])




    return (
        <div className="reelsHolder" style={{
            display: reelsArr.length !== 0 ? "grid" : "none"
        }}>
            {renderReels}
        </div>
    )
}

export default ReelsHolder