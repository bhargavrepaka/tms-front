import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from './tasksSlice'
import usersReducer from './usersSlices'
import authReducer from "./authSlice"
export const store = configureStore({
    reducer:{
        tasks:tasksReducer,
        users:usersReducer,
        auth:authReducer
    }
})