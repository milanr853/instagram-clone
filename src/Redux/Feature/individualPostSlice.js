import { createSlice } from "@reduxjs/toolkit";


const initialState = { value: "none" }

const individualPostDisplay = createSlice({
    name: "individualPostDisplay",
    initialState,
    reducers: {
        showIndividualPost: (state, action) => {
            state.value = "flex"
        },
        hideIndividualPost: (state, action) => {
            state.value = "none"
        }
    }
})


export const { showIndividualPost, hideIndividualPost } = individualPostDisplay.actions

export default individualPostDisplay.reducer