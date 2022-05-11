import { createSlice } from "@reduxjs/toolkit";


const initialState = { value: "none", selectedImg: "", userData: "" }

const individualPostDisplay = createSlice({
    name: "individualPostDisplay",
    initialState,
    reducers: {
        showIndividualPost: (state, action) => {
            state.value = "flex"
        },
        hideIndividualPost: (state, action) => {
            state.value = "none"
        },
        chooseImg: (state, { payload }) => {
            const { clickedImg, All_Images, Username, ProfilePic, ID } = payload
            const selected = All_Images.filter(obj => {
                if (obj.url === clickedImg) return obj
            })
            state.selectedImg = selected[0]
            state.userData = { Username, ProfilePic, ID }
        }
    }
})


export const { showIndividualPost, hideIndividualPost, chooseImg } = individualPostDisplay.actions

export default individualPostDisplay.reducer