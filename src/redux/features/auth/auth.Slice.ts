import { createSlice } from "@reduxjs/toolkit";
import { userForgotPassword, userLogin, userLogout, userResetPassword, userSession, userSignup, userVerifyOtp } from "./auth.Action";
import { stat } from "fs";


interface Authdata{
    users:any ,
    user:any,
    loading:boolean,
    message:String | null,
    error:string | null,
    islogin:boolean,
    isSentOtp:boolean,
    isVerifiedOtp:boolean,
}
const initialState:Authdata ={
    users:[],
    user:{},
    loading:false,
    message:null,
    error:null,
    islogin:false,
    isSentOtp:false,
    isVerifiedOtp:false,
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
            state.error = action.payload ?? null;
        });

        // 2. user signup
        builder.addCase(userSignup.pending,(state)=>{
            state.loading = true;
            state.message = null;
            state.error = null;
        }).addCase(userSignup.fulfilled,(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
        }).addCase(userSignup.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload ?? null;
        });

        // 3. user logout
        builder.addCase(userLogout.pending,(state)=>{
            state.loading = true;
            state.message = null;
            state.error = null;
        }).addCase(userLogout.fulfilled,(state,action)=>{
            state.loading = false;
            state.islogin = false;
            state.message = action.payload.message;
            state.user = {};
        }).addCase(userLogout.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload ?? null;
        });

        // 4. user Session
        builder.addCase(userSession.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.message = null;
        }).addCase(userSession.fulfilled,(state,action)=>{
            state.loading = false;
            state.islogin = true;
            state.user = action.payload.user;
        }).addCase(userSession.rejected,(state,action)=>{
            state.loading = false;
            state.islogin = false;
        });

        // 5. User forot password
        builder.addCase(userForgotPassword.pending,(state)=>{
            state.loading = true;
            state.message = null;
            state.error = null;
        }).addCase(userForgotPassword.fulfilled,(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.isSentOtp = true;
        }).addCase(userForgotPassword.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload ?? null;
        });

        // 6. user verifyotp
        builder.addCase(userVerifyOtp.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.message = null;
        }).addCase(userVerifyOtp.fulfilled,(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.isVerifiedOtp = true;
        }).addCase(userVerifyOtp.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload ?? null;
        });

        // 7. user resetPassword
        builder.addCase(userResetPassword.pending,(state)=>{
            state.loading = true;
            state.message = null;
            state.error = null;
        }).addCase(userResetPassword.fulfilled,(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
        }).addCase(userResetPassword.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload ?? null;
        })
    }
})


export default authSlice.reducer;