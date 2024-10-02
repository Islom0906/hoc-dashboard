import {configureStore} from '@reduxjs/toolkit'
import themeSlice from "./slice/themeSlice";
import authSlice from './slice/authSlice'
import querySlice from "./slice/querySlice";
import companySlice from "./slice/companySlice";
import modulsSlice from "./slice/modulsSlice";
import staffSlice from "./slice/staffSlice";

export const store = configureStore({
    reducer: {
        theme: themeSlice,
        auth: authSlice,
        query:querySlice,
        companySlice:companySlice,
        modulsSlice:modulsSlice,
        staffSlice:staffSlice
    },
})