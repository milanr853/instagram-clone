import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../../Database/firebaseConfig'
import { removeDeleteOption } from '../../Redux/Feature/deleteOptionVisibility'
import { hideIndividualPost } from '../../Redux/Feature/individualPostSlice'




function DeletePostOption() {
    const DeleteOption = useSelector(store => store.deletePostSlice.delete)

    const { del_Username, del_Image_ID, del_User_ID } = useSelector(store => store.deletePostSlice)


    const dispatch = useDispatch()


    //DELETE POST
    const deletePost = async () => {
        if (del_Username === "" || del_Image_ID === "" || del_User_ID === "") return

        //for reels collection
        const reel_DocRef = doc(db, "reels", del_Username)
        const reelResponse = await getDoc(reel_DocRef)
        const currentReel_Id = reelResponse.data()
        if (currentReel_Id) {
            if (currentReel_Id.postImage_id === del_Image_ID)
                await deleteDoc(reel_DocRef)
        }

        //for likes sub-collection || doc-username
        const register_DocRef_lks = doc(db, "registeredUsersCredentials",
            del_User_ID, `LikesFor${del_Image_ID}`, del_Username)
        const likeRes = await getDoc(register_DocRef_lks)
        if (likeRes.data()) await deleteDoc(register_DocRef_lks)

        //for comments sub-collection
        const register_CollRef_cmts = collection(db, "registeredUsersCredentials",
            del_User_ID, `CommentsFor${del_Image_ID}`)
        const cmt_response = await getDocs(register_CollRef_cmts)
        if (cmt_response.docs.length !== 0)
            cmt_response.docs.map(async (obj) => {
                const register_DocRef_cmts = doc(db, "registeredUsersCredentials",
                    del_User_ID, `CommentsFor${del_Image_ID}`, obj.id)
                const cmntRes = await getDoc(register_DocRef_cmts)
                if (cmntRes.data()) await deleteDoc(register_DocRef_cmts)
            })

        // for posts collection
        const posts_DocRef = doc(db, "mainDisplayPosts", del_Image_ID)
        const postRef = await getDoc(posts_DocRef)
        if (postRef.data()) await deleteDoc(posts_DocRef)


        //for the main image
        const userDataCollection = doc(db, "registeredUsersCredentials", del_User_ID)
        const response = await getDoc(userDataCollection)

        let All_Images = response.data().All_Images
            .filter(imgObj => {
                if (imgObj.id !== del_Image_ID) return imgObj
            })
        updateDoc(userDataCollection, { All_Images: All_Images })

        // -----------------------------
        dispatch(removeDeleteOption())
        dispatch(hideIndividualPost())

        document.querySelector("body").style.overflowY = "scroll"
    }




    return (
        <div className='D_container' style={{
            width: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            height: "100vh",
            position: "fixed",
            zIndex: "1100",
            top: "0",
            display: DeleteOption === true ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center"
        }} onClick={(e) => {
            if (![...e.target.classList].includes("deletePost")) dispatch(removeDeleteOption())
        }}>
            <button className="deletePost" style={{
                width: "240px",
                height: "50px",
                fontWeight: "bold",
                background: "white",
                color: "crimson",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
            }} onClick={deletePost}>
                Delete Post
            </button>
        </div>
    )
}

export default DeletePostOption