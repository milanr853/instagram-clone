import { createSlice } from "@reduxjs/toolkit";



const initialState = { UserID: null, ImageID: null, authLike: false }



const likePostSlice = createSlice({
    name: "likePostSlice",
    initialState,
    reducers: {
        collectIDs: (state, { payload }) => {
            const { UserID, ImageID, authLike } = payload
            state.UserID = UserID
            state.ImageID = ImageID
            state.authLike = authLike
        },
        removeIDs: (state, action) => {
            state.UserID = null
            state.ImageID = null
            state.authLike = null
        }
    }
})

export const { collectIDs, removeIDs } = likePostSlice.actions

export default likePostSlice.reducer