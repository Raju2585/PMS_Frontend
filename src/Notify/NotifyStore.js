import { configureStore } from "@reduxjs/toolkit";
import NotifySlice from "./NotifySlice";


const store=configureStore({
    reducer:{
        notifications:NotifySlice
    }
})

export default store;
