import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    value: []
}


export const fetchAll_Images = createAsyncThunk("images/fetchAll_Images", async () => {
    const response = await fetch('https://api.unsplash.com/photos/?client_id=nzZuZsAmbCFgtpC8O6siPFbTHyaW8gbEWdFO55aENMg')
    const data = await response.json()
    return data
})


const imagesSlice = createSlice({
    name: "images",
    initialState,
    reducers: {
    },
    extraReducers: {
        [fetchAll_Images.fulfilled]: (state, { payload }) => {
            state.value = payload
        }
    }
})


export const { getAll_Images } = imagesSlice.actions

export default imagesSlice.reducer