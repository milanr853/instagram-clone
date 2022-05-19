import { createSlice } from "@reduxjs/toolkit";



const initialState = { delete: false, del_User_ID: "", del_Username: "", del_Image_ID: "" }



const deletePostSlice = createSlice({
    name: "deletePostSlice",
    initialState,
    reducers: {
        setShowDeleteOption: (state, action) => {
            state.delete = true
        },
        removeDeleteOption: (state, action) => {
            state.delete = false
            state.del_User_ID = ""
            state.del_Username = ""
            state.del_Image_ID = ""
        },
        collectImageAndUserInfoToDeletePost: (state, { payload }) => {
            state.del_User_ID = payload.User_ID
            state.del_Username = payload.Username
            state.del_Image_ID = payload.Image_ID
        }
    }
})

export const { setShowDeleteOption, removeDeleteOption, collectImageAndUserInfoToDeletePost } = deletePostSlice.actions

export default deletePostSlice.reducer