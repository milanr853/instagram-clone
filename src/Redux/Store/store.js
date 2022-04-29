import { configureStore } from "@reduxjs/toolkit"

import imagesReducer from "../Feature/imagesSlice"
import accountOptionsVisibilityReducer from "../Feature/accountOptionsVisibilitySlice"
import uploadPostOptionVisibilityReducer from "../Feature/uploadPostOptionVisibilitySlice"
import isAuthenticated from "../Feature/isAuthenticated"
import showSearchResultsContainer from "../Feature/showSearchResultsContainerSlice"
import individualPostDisplayReducer from "../Feature/individualPostSlice"
import userReducer from "../Feature/usersSlice"
import selectedUserReducer from "../Feature/selectedUserSlice"
import inputReducer from "../Feature/inputSlice"




const store = configureStore({
    reducer: {
        imagesReducer,
        accountOptionsVisibilityReducer,
        uploadPostOptionVisibilityReducer,
        isAuthenticated,
        showSearchResultsContainer,
        individualPostDisplayReducer,

        userReducer,
        selectedUserReducer,
        inputReducer
    }
})


export default store