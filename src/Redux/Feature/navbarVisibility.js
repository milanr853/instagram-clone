import { createSlice } from "@reduxjs/toolkit";



const initialState = { value: false, count: 0 }



const navVisibilitySlice = createSlice({
    name: "inputSlice",
    initialState,
    reducers: {
        setNavVisibility: (state, { payload }) => {
            if (state.count > 0) return
            if (payload > 0) {
                state.value = true
                state.count = 1
            }
        }
    }
})

export const { setNavVisibility } = navVisibilitySlice.actions

export default navVisibilitySlice.reducer