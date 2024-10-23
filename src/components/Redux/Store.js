import { configureStore } from "@reduxjs/toolkit";
import NotifySlice from './Slices/NotificationSlice'


const store=configureStore({
    reducer:{
        appointments:NotifySlice
    }
})

export default store;
