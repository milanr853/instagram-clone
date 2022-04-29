import { createSlice } from "@reduxjs/toolkit";
import { allUsersData } from "../../allUsersDataStore"

const initialState = { value: {} }

const Data = allUsersData()

const selectedUserSlice = createSlice({
    name: "selectedUser",
    initialState,
    reducers: {
        setSelectedUser: (state, { payload }) => {
            const selected = Data.filter(user => {
                const { login } = user
                if (login.username === payload) return user
            })
            state.value = selected[0]
        },
    }
})


export const { setSelectedUser } = selectedUserSlice.actions

export default selectedUserSlice.reducer