import "./settings.css"
import React, { useRef, useState } from 'react'
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { auth, db } from "../../Database/firebaseConfig"
import { useSelector } from "react-redux"
import { deleteUser, signOut } from "firebase/auth"
import { useAuth } from "../../Database/authenticate"




function Settings() {

    const user = useAuth()

    const [bio, setBio] = useState("")

    const [confirmBoxDisplay, setConfirmBoxDisplay] = useState(false)

    const bioRef = useRef()

    let authUserData = useSelector(store => store.selectedUserDataReducer.authUserData)


    const addBioOfUser = () => {
        if (!bio) return
        const docRef = doc(db, "registeredUsersCredentials", authUserData.id)
        updateDoc(docRef, {
            Bio: bio
        })

        bioRef.current.value = ""
        setBio("")
    }


    const AreYouSureToDeleteAccount = () => setConfirmBoxDisplay(true)


    const deleteAccount = async () => {
        //reels
        const reelRef = doc(db, "reels", authUserData.Username)
        const reelDoc = await getDoc(reelRef)
        if (reelDoc.data()) deleteDoc(reelRef)

        //posts
        const postsRef = collection(db, "mainDisplayPosts")
        getDocs(postsRef).then(DocsRef => {
            DocsRef.docs.forEach(
                document =>
                    document.data().user_username === authUserData.Username ?
                        deleteDoc(doc(db, "mainDisplayPosts", document.id))
                        :
                        null
            )
        })

        // main db
        const docRef = doc(db, "registeredUsersCredentials", authUserData.id)
        // authentication
        await deleteUser(user)
        // ----------
        const docRes = await getDoc(docRef)
        if (docRes.data()) deleteDoc(docRef)


        setConfirmBoxDisplay(false)
        signOut(auth)
    }




    return (
        <>
            <div className="settings">
                <div style={{
                    width: "30%",
                    height: "100%",
                    borderRight: "1px solid lightgray"
                }}>
                    <strong style={{
                        width: "100%",
                        height: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>Add your bio</strong>
                    <strong style={{
                        width: "100%",
                        height: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>Delete account</strong>
                </div>

                <div style={{
                    width: "70%",
                    height: "100%",
                }}>
                    <div className="addUserBio">
                        <div className="bioUpperFeatures">
                            <textarea name="bio" id="bio" maxLength={250} ref={bioRef} placeholder="Add Your Bio..." onChange={(e) => { setBio(e.target.value.trim()) }}></textarea>
                        </div>
                        <button className="bioSubmit" onClick={addBioOfUser}>Submit</button>
                    </div>
                    <div className="deleteAcc">
                        <div id="deleteAccountButton" onClick={AreYouSureToDeleteAccount}>Delete Account</div>
                    </div>
                </div>

                <div className="border" style={{
                    background: "lightgray",
                    width: "100%",
                    height: "1px",
                    position: "absolute"
                }}></div>
            </div>

            {/* ------------------------------- */}
            <div className="accountDeleteConfirmationBox" style={{
                width: "100vw",
                height: "100vh",
                position: "fixed",
                background: "rgba(0,0,0,0.6)",
                // opacity: "0.7",
                top: "0",
                display: confirmBoxDisplay ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div className="confirmBox" style={{ textAlign: "center" }}>
                    <h2 style={{ margin: "10px 0" }}>Are you sure?</h2>
                    <div style={{ width: "100%", height: "1px", background: "lightgray", }}></div>
                    <div className="optionButtons" style={{
                        width: "100%",
                        height: "90px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <button id="yes" style={{
                            border: "1px solid lightgray",
                            borderRadius: "4px",
                            height: "40px",
                            width: "50px",
                            cursor: "pointer",
                            marginRight: "50px"
                        }} onClick={deleteAccount}>Yes</button>

                        <button id="no" style={{
                            border: "1px solid lightgray",
                            borderRadius: "4px",
                            height: "40px",
                            width: "50px",
                            cursor: "pointer"
                        }} onClick={() => setConfirmBoxDisplay(false)}>No</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings