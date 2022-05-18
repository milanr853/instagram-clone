import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import App from './App'
import ToAuthenticate from './ToAuthenticate'
import { readFirebaseDB } from './Database/firestoreDB'
import { getFirebaseUsersData } from './Redux/Feature/firebaseUsersDatabaseSlice'
import { getAllDataAndAuthUserMail } from './Redux/Feature/selectedUserDataSlice'
import { useAuth } from './Database/authenticate'
import { setNavVisibility } from './Redux/Feature/navbarVisibility'




function Wrapper() {

    const dispatch = useDispatch()

    const { timelinePosts } = useSelector(store => store.timelinePostsReducer)


    //Get current user || Session Continuity
    const user = useAuth()


    //Save data from Firebase data into Store
    useEffect(() => {
        const getData = async () => {
            const allUsersData = await readFirebaseDB()
            dispatch(getFirebaseUsersData(allUsersData))
        }
        getData()
    }, [user, timelinePosts])


    //Get All Users Data from Store
    const All_Data = useSelector(store => store.firestoreDBReducer.value)



    //Dispatch Action to get the current user data from Store
    useEffect(() => {
        dispatch(getAllDataAndAuthUserMail({ DB: All_Data, currentUserMail: user?.email, username: "" }))
    }, [user, All_Data])


    useEffect(() => {
        dispatch(setNavVisibility(All_Data.length))
    }, [All_Data])


    // ------------------------------------------
    return (
        user?.email ? <App /> : <ToAuthenticate />
    )
}

export default Wrapper