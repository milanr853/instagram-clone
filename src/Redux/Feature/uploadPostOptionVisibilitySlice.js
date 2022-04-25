import { createSlice } from "@reduxjs/toolkit";



const initialState = { display: "none" }


const uploadPostOptionVisibilitySlice = createSlice({
    name: "uploadPostOptionVisibilitySlice",
    initialState,
    reducers: {
        makeUploadOptionsVisible: (state, action) => {
            state.display = "flex";
        },
        makeUploadOptionsDisappear: (state, action) => {
            state.display = "none";
        }
    }
})


export const { makeUploadOptionsVisible, makeUploadOptionsDisappear } = uploadPostOptionVisibilitySlice.actions

export default uploadPostOptionVisibilitySlice.reducer