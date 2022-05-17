import { createSlice } from "@reduxjs/toolkit";


const initialState = { value: [] }

//All Users Data || Fetched from firebase
const firestoreDBSlice = createSlice({
    name: "firestoreDBSlice",
    initialState,
    reducers: {
        getFirebaseUsersData: (state, { payload }) => {
            state.value = payload
        }
    }
})


export const { getFirebaseUsersData } = firestoreDBSlice.actions
export default firestoreDBSlice.reducer