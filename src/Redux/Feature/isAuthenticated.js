import { createSlice } from "@reduxjs/toolkit";


const initialState = { value: true }

const isAuthenticated = createSlice({
    name: "isAuthenticated",
    initialState,
    reducers: {
        makeAuthenticate: (state, action) => {
            state.value = true
        },
        logOut: (state, action) => {
            state.value = false
        }
    }
})


export const { makeAuthenticate, logOut } = isAuthenticated.actions

export default isAuthenticated.reducer