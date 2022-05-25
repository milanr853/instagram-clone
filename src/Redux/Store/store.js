import { configureStore } from "@reduxjs/toolkit"
import accountOptionsVisibilityReducer from "../Feature/accountOptionsVisibilitySlice"
import uploadPostOptionVisibilityReducer from "../Feature/uploadPostOptionVisibilitySlice"
import showSearchResultsContainer from "../Feature/showSearchResultsContainerSlice"
import individualPostDisplayReducer from "../Feature/individualPostSlice"
import inputReducer from "../Feature/inputSlice"
import firestoreDBReducer from "../Feature/firebaseUsersDatabaseSlice"
import selectedUserDataReducer from "../Feature/selectedUserDataSlice"
import navbarVisibility from "../Feature/navbarVisibility"
import deletePostSlice from "../Feature/deleteOptionVisibility"


const store = configureStore({
    reducer: {
        uploadPostOptionVisibilityReducer,
        accountOptionsVisibilityReducer,
        individualPostDisplayReducer,
        showSearchResultsContainer,
        navbarVisibility,

        inputReducer,
        deletePostSlice,
        firestoreDBReducer,
        selectedUserDataReducer,
    }
})


export default store