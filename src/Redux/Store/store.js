import { configureStore } from "@reduxjs/toolkit"

import imagesReducer from "../Feature/imagesSlice"
import accountOptionsVisibilityReducer from "../Feature/accountOptionsVisibilitySlice"




const store = configureStore({
    reducer: {
        imagesReducer,
        accountOptionsVisibilityReducer
    }
})


export default store