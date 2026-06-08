import { createSlice } from "@reduxjs/toolkit";
import { userLogin } from "./auth.Action";

const initialState ={
    users:[],
    user:{},
    loading:false,
    message:null,
    error:null,
    islogin:false,
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        //1. user login
        builder.addCase(userLogin.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.message = null;
        }).addCase(userLogin.fulfilled,(state,action)=>{
            state.loading = false;
            state.user = action.payload?.user;
            state.message = action.payload?.message;
            state.islogin = true;
        }).addCase(userLogin.rejected,(state,action)=>{
            state.loading = false;
            state.islogin = false;
            state.error = action.payload;
        })
    }
})