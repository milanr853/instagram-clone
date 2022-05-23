import "./settings.css"
import React, { useRef, useState } from 'react'
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { auth, db } from "../../Database/firebaseConfig"
import { useSelector } from "react-redux"
import { deleteUser, signOut, updatePassword } from "firebase/auth"
import { useAuth } from "../../Database/authenticate"




function Settings() {

    const user = useAuth()

    const [bio, setBio] = useState("")

    const [userEmail, setUserEmail] = useState("")

    const [userPassword, setUserPassword] = useState("")

    const [confirmBoxDisplay, setConfirmBoxDisplay] = useState(false)

    const bioRef = useRef()

    const emailRef = useRef()

    const passwordRef = useRef()

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


    const updateEmail = () => {
        if (!userEmail) return
        const docRef = doc(db, "registeredUsersCredentials", authUserData.id)
        updateDoc(docRef, {
            Email: userEmail
        })

        updateEmail(user, userEmail)

        emailRef.current.value = ""
        setUserEmail("")
    }


    const changePassword = () => {
        if (!userPassword) return
        const docRef = doc(db, "registeredUsersCredentials", authUserData.id)
        updateDoc(docRef, {
            Password: userPassword
        })

        updatePassword(user, userPassword)

        passwordRef.current.value = ""
        setUserPassword("")
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
                <div className="settingsObjective" style={{
                    width: "30%",
                    height: "100%",
                    borderRight: "1px solid lightgray",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
                    <div style={{
                        width: "100%",
                        height: "100%",
                        borderBottom: "1px solid lightgray",
                        display: "flex",
                        alignItems: "center",
                    }}><strong >Add your bio</strong></div>
                    <div style={{
                        width: "100%",
                        height: "100%",
                        borderBottom: "1px solid lightgray",
                        display: "flex",
                        alignItems: "center",
                    }}><strong >Edit your email</strong></div>
                    <div style={{
                        width: "100%",
                        height: "100%",
                        borderBottom: "1px solid lightgray",
                        display: "flex",
                        alignItems: "center",
                    }}><strong >Change your password</strong></div>
                    <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                    }}><strong >Delete account</strong></div>
                </div>

                <div style={{
                    width: "70%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}>

                    <div className="addUserBio">
                        <textarea name="bio" id="bio" maxLength={250} ref={bioRef}
                            placeholder="Add Your Bio..." onChange={(e) => { setBio(e.target.value.trim()) }}>
                        </textarea>
                        <button className="bioSubmit" onClick={addBioOfUser}>Submit</button>
                    </div>

                    <div className="updateEmail">
                        <input type="text" id="emailUpdate" ref={emailRef}
                            placeholder="Change email" onChange={(e) => { setUserEmail(e.target.value.trim()) }} />
                        <button id="emailUpdateBtn" onClick={updateEmail}>Update Email</button>
                    </div>

                    <div className="changePassword">
                        <input type="text" maxLength={20} id="passwordChange" ref={passwordRef}
                            placeholder="Change password" onChange={(e) => { setUserPassword(e.target.value.trim()) }} />
                        <button id="passwordChangeBtn" onClick={changePassword}>Change Password</button>
                    </div>

                    <div className="deleteAcc">
                        <div id="deleteAccountButton" onClick={AreYouSureToDeleteAccount}><p>Delete Account</p></div>
                    </div>

                </div>

            </div>

            {/* ------------------------------- */}
            <div className="accountDeleteConfirmationBox" style={{
                width: "100vw",
                height: "100vh",
                position: "fixed",
                background: "rgba(0,0,0,0.6)",
                top: "0",
                display: confirmBoxDisplay ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center"
            }} onClick={(e) => { if (e.target.id !== "yes") setConfirmBoxDisplay(false) }}>
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
                            width: "80px",
                            cursor: "pointer",
                        }} onClick={deleteAccount}>Yes</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings