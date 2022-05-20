import { createSlice } from "@reduxjs/toolkit";


const initialState = { authUserData: {}, specificProfileData: {} }


const selectedUserDataSlice = createSlice({
    name: "selectedUserDataSlice",
    initialState,
    reducers: {
        //Authenticated User Data || Filtered from total users
        getAllDataAndAuthUserMail: (state, { payload }) => {
            const { DB, currentUserMail } = payload
            for (let i = 0; i < DB.length; i++) {
                if (currentUserMail === DB[i].Email) {
                    state.authUserData = DB[i]
                    break
                }
            }
        },
        //Specific User Data
        getSpecificUserProfile: (state, { payload }) => {
            const { All_Data, selectedUser } = payload
            for (let i = 0; i < All_Data.length; i++) {
                if (selectedUser === All_Data[i].Username) {
                    state.specificProfileData = All_Data[i]
                    break
                }
            }
        },
        // clearUserData: (state, action) => {
        //     state.specificProfileData = {}
        // }
    }
})


export const { getSpecificUserProfile, getAllDataAndAuthUserMail, clearUserData } = selectedUserDataSlice.actions
export default selectedUserDataSlice.reducer