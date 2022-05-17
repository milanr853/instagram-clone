import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Database/firebaseConfig";


const initialState = { value: "none", selectedImg: "", userData: "" }

export const selectImgObjAsync = createAsyncThunk(
    "individualPost/selectImgObjAsync",
    async ({ user_ID, clickedImg }) => {
        try {
            const docRef = doc(db, "registeredUsersCredentials", user_ID)
            const response = await getDoc(docRef)
            return { ...response.data(), clickedImg, ID: user_ID }
        } catch (error) {
            console.log(error)
        }
    }
)


const individualPostDisplay = createSlice({
    name: "individualPostDisplay",
    initialState,
    reducers: {
        showIndividualPost: (state, action) => {
            state.value = "flex"
        },
        hideIndividualPost: (state, action) => {
            state.value = "none"
            state.selectedImg = ""
            state.userData = ""
        },
    },
    //Gather Particular Image Details
    extraReducers: {
        [selectImgObjAsync.fulfilled]: (state, { payload }) => {
            const { Username, ProfilePic, clickedImg, All_Images, ID } = payload
            const selected = All_Images.filter(obj => {
                if (obj.url === clickedImg) return obj
            })
            return {
                ...state,
                //Specific Image || Clicked Image
                selectedImg: selected[0],
                //Linked User Data (to the image)
                userData: { Username, ProfilePic, ID }
            }
        }
    }
})


export const { showIndividualPost, hideIndividualPost } = individualPostDisplay.actions

export default individualPostDisplay.reducer