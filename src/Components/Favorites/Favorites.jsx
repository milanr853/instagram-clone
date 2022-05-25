import "./favorites.css"
import React, { useEffect, useState } from 'react'
import InitialLoading from "../InitialLoading/InitialLoading"
import { useDispatch, useSelector } from "react-redux"
import { db } from "../../Database/firebaseConfig"
import { collection, doc, onSnapshot, query } from "firebase/firestore"
import { selectImgObjAsync, showIndividualPost } from "../../Redux/Feature/individualPostSlice"




function Favorites() {
    const navVisibility = useSelector(store => store.navbarVisibility.value)

    const { Username } =
        useSelector(store =>
            store.selectedUserDataReducer.authUserData)

    const dispatch = useDispatch()

    const [BookmarkArr, setBookmarkArr] = useState([])

    const [renderBookmarks, setRenderBookmarks] = useState([])


    useEffect(() => {
        if (!Username) return
        onSnapshot(query(doc(db, 'bookmarks', Username)), snapshot => {
            const { bookmarkArr } = snapshot.data()
            setBookmarkArr(bookmarkArr)
        })
    }, [db, Username])


    useEffect(() => {
        setRenderBookmarks(BookmarkArr && BookmarkArr.length > 0 ?
            BookmarkArr?.map(elem => {
                const { user_username, user_ID, postImage_url, postImage_id } = elem

                const ShowIndividualPost = (e) => {
                    dispatch(selectImgObjAsync({
                        user_ID
                        , clickedImg: postImage_url
                    }))
                    dispatch(showIndividualPost())
                    document.querySelector("body").style.overflowY = "hidden"
                }


                return (
                    <div className="bookmarkedInfo" key={postImage_id} onClick={ShowIndividualPost} style={{ cursor: 'pointer' }}>
                        <p className="bookmark_info">You bookmarked
                            {user_username !== Username ?
                                <strong> {user_username}'s </strong>
                                : " this "}post
                        </p>
                        <div className="bookmark_img_section">
                            <img src={postImage_url} alt="bookmark" />
                        </div>
                    </div>
                )
            })
            : [])
    }, [BookmarkArr])




    return (
        navVisibility ?
            <div className='Favorites'>
                {renderBookmarks}
            </div>
            : <InitialLoading />
    )
}

export default Favorites