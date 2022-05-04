import { createSlice } from "@reduxjs/toolkit";


const initialState = { value: [] }


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