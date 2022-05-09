import { configureStore } from "@reduxjs/toolkit"

import imagesReducer from "../Feature/imagesSlice"
import accountOptionsVisibilityReducer from "../Feature/accountOptionsVisibilitySlice"
import uploadPostOptionVisibilityReducer from "../Feature/uploadPostOptionVisibilitySlice"
import showSearchResultsContainer from "../Feature/showSearchResultsContainerSlice"
import individualPostDisplayReducer from "../Feature/individualPostSlice"
import inputReducer from "../Feature/inputSlice"
import firestoreDBReducer from "../Feature/firebaseUsersDatabaseSlice"
import selectedUserDataReducer from "../Feature/userDataFromDbSlice"



const store = configureStore({
    reducer: {
        imagesReducer,
        accountOptionsVisibilityReducer,
        uploadPostOptionVisibilityReducer,
        showSearchResultsContainer,
        individualPostDisplayReducer,

        inputReducer,
        firestoreDBReducer,
        selectedUserDataReducer,
    }
})


export default store