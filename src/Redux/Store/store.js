import { configureStore } from "@reduxjs/toolkit"

import imagesReducer from "../Feature/imagesSlice"
import accountOptionsVisibilityReducer from "../Feature/accountOptionsVisibilitySlice"
import uploadPostOptionVisibilityReducer from "../Feature/uploadPostOptionVisibilitySlice"
import isAuthenticated from "../Feature/isAuthenticated"
import showSearchResultsContainer from "../Feature/showSearchResultsContainerSlice"
import individualPostDisplayReducer from "../Feature/individualPostSlice"




const store = configureStore({
    reducer: {
        imagesReducer,
        accountOptionsVisibilityReducer,
        uploadPostOptionVisibilityReducer,
        isAuthenticated,
        showSearchResultsContainer,
        individualPostDisplayReducer
    }
})


export default store