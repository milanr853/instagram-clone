import { createSlice } from "@reduxjs/toolkit";


const initialState = { timelinePosts: {} }


const timelinePostsSlice = createSlice({
    name: "timelinePostsSlice",
    initialState,
    reducers: {
        setTimelinePosts: (state, { payload }) => {
            state.timelinePosts = payload
        }
    }
})


export const { setTimelinePosts } = timelinePostsSlice.actions
export default timelinePostsSlice.reducer