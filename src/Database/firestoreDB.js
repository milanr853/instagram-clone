import { db } from "./firebaseConfig";

import { collection, getDocs } from "firebase/firestore"


export const readFirebaseDB = async () => {
    const usersDataCollection = collection(db, "registeredUsersCredentials")
    const response = await getDocs(usersDataCollection)
    const Users = response.docs.map(doc => {
        return doc.data()
    })
    return Users
}