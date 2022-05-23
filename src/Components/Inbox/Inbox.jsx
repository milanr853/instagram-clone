import "./inbox.css"
import React, { useEffect, useRef, useState } from 'react'
import InitialLoading from "../InitialLoading/InitialLoading"
import { useSelector } from "react-redux"
import { arrayUnion, doc, updateDoc, getDoc, onSnapshot, query, collection } from "firebase/firestore"
import defaultImage from "../../Constant/defaultImage"
import { db } from "../../Database/firebaseConfig"
import { nanoid } from "@reduxjs/toolkit"




function Inbox() {
    const navVisibility = useSelector(store => store.navbarVisibility.value)

    const messageAreaRef = useRef()

    const [message, setMessage] = useState('')

    const [currentChat, setCurrentChat] = useState([])

    const [chatUsersArr, setChatUsersArr] = useState([])

    const [renderChat, setRenderChat] = useState([])

    const [renderReceivers, setRenderReceivers] = useState([])

    const { Username } =
        useSelector(store =>
            store.selectedUserDataReducer.authUserData)

    const [selectUser, setSelecteUser] = useState({})


    // ----------------------------
    const handleKeyboard = (e) => {
        if (!message) return

        if (e.keyCode === 13) {

            const messageData = {
                message: message,
                sender: Username,
                receiver: selectUser.Username,
            }

            const sortNames = [Username, selectUser.Username].sort()

            // -------Send Message--------
            const sendMessageFunctionality = async () => {
                const msgDocRef = doc(db, "chats", `${sortNames[0]}-${sortNames[1]}Chat`)
                const response = await getDoc(msgDocRef)
                if (response.data()) {
                    //User is present || Update it"
                    updateDoc(msgDocRef, { allMessages: arrayUnion(messageData) })
                }
                setMessage("")
                messageAreaRef.current.value = ""
            }
            sendMessageFunctionality()
            // ---------------
        }
    }


    useEffect(() => {
        document.addEventListener("keydown", handleKeyboard)
        return () => document.removeEventListener("keydown", handleKeyboard)
    }, [handleKeyboard])


    // ----------------------------------
    //Getting Receivers/Senders list from firebase
    useEffect(() => {
        onSnapshot(collection(db, "chats"), snapshot => {
            const chatUsers_arr = snapshot.docs.filter(obj => {
                if (obj.id.includes(Username)) return obj
            })
            setChatUsersArr(chatUsers_arr)
        })
    }, [db, Username])


    //Render Chat-Conversation
    useEffect(() => {
        const curr_chat = currentChat.length !== 0 ? currentChat.map(data => {
            return (
                <div className="user_message" key={nanoid()}
                    style={{
                        justifyContent: data.sender === Username ? "flex-end" : "flex-start",
                    }}>
                    <p style={{ background: data.sender === Username ? "#646FD4" : "#DBDFFD", }}
                        id="USER__MESSAGE">{data.message}</p>
                </div>
            )
        }) : []
        setRenderChat(curr_chat.reverse())
    }, [currentChat])


    //Render Chat-Users List
    useEffect(() => {
        const chat_user_Arr = chatUsersArr.map(obj => {
            const { Receiver, ReceiverPic, Sender, SenderPic } = obj.data()


            const selectChatUser = async (e) => {
                const sortNames = [Username, Username === Sender ? Receiver : Sender].sort()

                setSelecteUser({
                    Username: Username === Sender ? Receiver : Sender,
                    ProfilePic: Username === Sender ? ReceiverPic : SenderPic
                })
                const chatDocRef = doc(db, "chats", `${sortNames[0]}-${sortNames[1]}Chat`)

                //Current Chat 
                onSnapshot(query(chatDocRef), snapshot => setCurrentChat(snapshot.data().allMessages))

                const messagedUserHolder = document.querySelectorAll(".messagedUserHolder")
                messagedUserHolder.forEach(elem => elem.style.background = "white")
                e.target.parentNode.style.background = "rgb(244, 244, 244)"
            }


            return (
                <div className="messagedUserHolder" key={nanoid()} onClick={selectChatUser} >
                    <div className="Userimage_Message" style={{
                        background: `url(${Username === Sender ?
                            ReceiverPic ? ReceiverPic : defaultImage
                            : SenderPic ? SenderPic : defaultImage
                            })`,
                        backgroundPosition: "center",
                        backgroundSize: "cover"
                    }}></div>
                    <p className="UserName_Message">{
                        Username === Sender ? Receiver : Sender
                    }</p>
                    <div className="somecover" style={{
                        background: "transparent",
                        width: "100%",
                        height: "100%",
                        position: "absolute"
                    }}></div>
                </div>
            )
        })
        setRenderReceivers(chat_user_Arr)
    }, [chatUsersArr])




    return (
        navVisibility ?
            <div className='Inbox'>
                <div className="messengersBox">
                    <div className="gapbox"></div>

                    <div className="messengersGrid">
                        {/* --------------------- */}
                        {chatUsersArr.lenght !== 0 && renderReceivers}
                        {/* --------------------- */}
                    </div>

                </div>


                {currentChat.length !== 0 ?
                    <div className="messagesBox" >
                        <div className="messageBoxHeader" >
                            <p className="currentMessengerName">{selectUser.Username}</p>
                        </div>

                        <div className="messageBoxMessageArea" >
                            {/* --------------------- */}
                            {currentChat.length !== 0 && renderChat}
                            {/* --------------------- */}
                        </div>

                        <div className="messageBoxInput" style={{
                            display: !selectUser.Username ? "none" : "block"
                        }}>
                            <input type="text" placeholder="Message..." className="messageTypeArea"
                                onChange={(e) => setMessage(e.target.value.trim())} ref={messageAreaRef} />
                        </div>
                    </div>
                    :
                    <>
                        <div className="no_message">
                            <i className="bi bi-send" style={{
                                fontSize: "60px",
                                color: "lightgray",
                                marginBottom: "20px"
                            }}></i>
                            <p style={{ color: "lightgray" }}>Your messages</p>
                        </div>
                    </>}
            </div>
            : <InitialLoading />
    )
}

export default Inbox