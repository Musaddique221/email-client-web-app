import { configureStore } from "@reduxjs/toolkit"
import FilterSlice from "./slices/FilterSlice"
import ListSlice from "./slices/ListSlice"

export const store = configureStore({
    // reducers here
    reducer: { filters: FilterSlice, emailList: ListSlice },
})