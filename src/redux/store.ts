import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/auth/auth.Slice'
import fileReducer from './features/files/files.Slice'
const store = configureStore({
    reducer:{
        auth : authReducer,
        file : fileReducer,
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;