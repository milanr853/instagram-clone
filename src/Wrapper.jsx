import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import App from './App'
import ToAuthenticate from './ToAuthenticate'
import { readFirebaseDB } from './Database/firestoreDB'
import { getFirebaseUsersData } from './Redux/Feature/firebaseUsersDatabaseSlice'
import { getAllData } from './Redux/Feature/userDataFromDbSlice'
import { useAuth } from './Database/authenticate'




function Wrapper() {

    const dispatch = useDispatch()


    //Get current user || Session Continuity
    const user = useAuth()


    //Save data from Firebase data into Store
    useEffect(() => {
        const getData = async () => {
            const data = await readFirebaseDB()
            dispatch(getFirebaseUsersData(data))
        }
        getData()
    }, [user])


    //Get All Users Data from Store
    const All_Data = useSelector(store => store.firestoreDBReducer.value)



    //Dispatch Action to get the current user data from Store
    useEffect(() => {
        dispatch(getAllData({ DB: All_Data, currentUserMail: user?.email, username: "" }))
    }, [user, All_Data])




    // ------------------------------------------
    return (
        user?.email ? <App /> : <ToAuthenticate />
    )
}

export default Wrapper