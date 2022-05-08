import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth } from "./firebaseConfig"


export const useAuth = () => {
    const [user, setUser] = useState(null)


    //Get current user || Session Continuity
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return unsub
    }, [])
    return user
}