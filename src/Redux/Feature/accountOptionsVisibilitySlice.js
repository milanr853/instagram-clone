import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: "none" }

const accountOptionsVisibilitySlice = createSlice({
    name: "accountOptionsVisibility",
    initialState,
    reducers: {
        makeOptionsVisible: (state, action) => {
            state.value = "block"
        },
        makeOptionsDisappear: (state, action) => {
            state.value = "none"
        }
    }
})

export const { makeOptionsVisible, makeOptionsDisappear } = accountOptionsVisibilitySlice.actions

export default accountOptionsVisibilitySlice.reducer