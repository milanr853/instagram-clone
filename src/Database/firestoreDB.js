import { db } from "./firebaseConfig";

import { collection, getDocs } from "firebase/firestore"
import { deepCopy } from "@firebase/util";


export const readFirebaseDB = async () => {
    const usersDataCollection = collection(db, "registeredUsersCredentials")
    const response = await getDocs(usersDataCollection)
    const Users = response.docs.map(doc => {
        const obj = { ...doc.data() }
        obj.id = doc.id
        return obj
    })
    return Users
}