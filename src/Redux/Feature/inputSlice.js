import { createSlice } from "@reduxjs/toolkit";



const initialState = { input: "" }



const inputSlice = createSlice({
    name: "inputSlice",
    initialState,
    reducers: {
        setInput: (state, { payload }) => {
            state.input = payload.trim()
        }
    }
})

export const { setInput } = inputSlice.actions

export default inputSlice.reducer