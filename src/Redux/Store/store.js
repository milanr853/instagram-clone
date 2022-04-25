import { configureStore } from "@reduxjs/toolkit"

import imagesReducer from "../Feature/imagesSlice"
import accountOptionsVisibilityReducer from "../Feature/accountOptionsVisibilitySlice"
import uploadPostOptionVisibilityReducer from "../Feature/uploadPostOptionVisibilitySlice"




const store = configureStore({
    reducer: {
        imagesReducer,
        accountOptionsVisibilityReducer,
        uploadPostOptionVisibilityReducer
    }
})


export default store