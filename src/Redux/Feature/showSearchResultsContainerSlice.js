import { createSlice } from "@reduxjs/toolkit";


const initialState = { value: "none" }

const showSearchResultsContainer = createSlice({
    name: "showSearchResultsContainer",
    initialState,
    reducers: {
        showContainer: (state, action) => {
            state.value = "flex"
        },
        disappearContainer: (state, action) => {
            state.value = "none"
        }
    }
})


export const { showContainer, disappearContainer } = showSearchResultsContainer.actions

export default showSearchResultsContainer.reducer