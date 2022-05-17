import { configureStore } from "@reduxjs/toolkit"
import accountOptionsVisibilityReducer from "../Feature/accountOptionsVisibilitySlice"
import uploadPostOptionVisibilityReducer from "../Feature/uploadPostOptionVisibilitySlice"
import showSearchResultsContainer from "../Feature/showSearchResultsContainerSlice"
import individualPostDisplayReducer from "../Feature/individualPostSlice"
import inputReducer from "../Feature/inputSlice"
import firestoreDBReducer from "../Feature/firebaseUsersDatabaseSlice"
import selectedUserDataReducer from "../Feature/selectedUserDataSlice"
import likePostReducer from "../Feature/likePostSlice"
import timelinePostsReducer from "../Feature/timelinePostsSlice"


const store = configureStore({
    reducer: {
        accountOptionsVisibilityReducer,
        uploadPostOptionVisibilityReducer,
        showSearchResultsContainer,
        individualPostDisplayReducer,

        inputReducer,
        firestoreDBReducer,
        selectedUserDataReducer,
        likePostReducer,
        timelinePostsReducer
    }
})


export default store