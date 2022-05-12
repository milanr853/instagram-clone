import { createSlice } from "@reduxjs/toolkit";



const initialState = { authUser: {} }



const authUserSlice = createSlice({
    name: "authUserSlice",
    initialState,
    reducers: {
        setAuthUserData: (state, { payload }) => {
            state.authUser = payload
        }
    }
})

export const { setAuthUserData } = authUserSlice.actions

export default authUserSlice.reducer