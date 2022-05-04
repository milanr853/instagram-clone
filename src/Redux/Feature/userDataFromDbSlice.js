import { createSlice } from "@reduxjs/toolkit";


const initialState = { userData: {} }


const selectedUserDataSlice = createSlice({
    name: "selectedUserDataSlice",
    initialState,
    reducers: {
        getAllData: (state, { payload }) => {
            const { DB, currentUserMail } = payload
            for (let i = 0; i < DB.length; i++) {
                if (currentUserMail === DB[i].Email) {
                    state.userData = DB[i]
                    break
                }
            }
        },

    }
})


export const { getUserDataFromDB, getAllData } = selectedUserDataSlice.actions
export default selectedUserDataSlice.reducer