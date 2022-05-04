import { createSlice } from "@reduxjs/toolkit";

const initialState = { allFetched: [], requiredData: [] }



const response = []


const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        getRequiredData: (state, { payload }) => {
            const allUsers = payload.map(user => {
                const { login, name, picture } = user
                return { login, name, picture }
            })
            state.requiredData = allUsers
        },
        fetchAll_Users: (state, action) => {
            state.allFetched = response
        }
    }
})

export const { getRequiredData, fetchAll_Users } = userSlice.actions

export default userSlice.reducer