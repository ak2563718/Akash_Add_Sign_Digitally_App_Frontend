import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseuri = 'https://akash-add-sign-digitally-app-backend.onrender.com/api/auth';
interface loginData{
    email:string,
    password:string
}
interface signuData{
    name:string,
    email:string,
    username:string,
    password:string,
}

// 1. User Login Api call
export const userLogin = createAsyncThunk<any,loginData,{rejectValue:string}>(
    'user/login',
    async( info, { rejectWithValue })=>{
        try {
            const { data } = await axios.post(`${baseuri}/login`,info,{
                headers:{'Content-Type':'application/json'},
                withCredentials:true,
            })
            return data;
        } catch (error) {
            if(axios.isAxiosError(error)){
                return rejectWithValue(error.response?.data?.message)
            }
            return rejectWithValue("something went wrong")
        }
    }
)

// 2. User Signup/register Api call
export const userSignup = createAsyncThunk<any,signuData,{rejectValue:string}>(
    'user/signup',
    async( info, { rejectWithValue })=>{
        try {
            const { data } = await axios.post(`${baseuri}/register`,info,{
                headers:{'Content-Type':'application/json'},
                withCredentials:true,
            })
            return data;
        } catch (error) {
            if(axios.isAxiosError(error)){
                return rejectWithValue(error.response?.data?.message)
            }
            return rejectWithValue("something went wrong")
        }
    }
)

// 3 . User Logout api call 
export const userLogout = createAsyncThunk<any, void, {rejectValue:string}>(
    'user/logout',
    async( _ , { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${baseuri}/logout`,{
                headers:{'Content-Type':'application/json'},
                withCredentials:true,
            })
            return data;
        } catch (error) {
           if(axios.isAxiosError(error)){
            return rejectWithValue(error.response?.data?.message)
           } 
           return rejectWithValue("something went wrong")
        }
    }
)

// 4. Check user Session Api call
export const userSession = createAsyncThunk<any, void,{rejectValue:string}>(
    'user/session',
    async( _ , {rejectWithValue}) => {
        try {
            const { data } = await axios.get(`${baseuri}/check-session`,{
                headers:{'Content-Type':'application/json'},
                withCredentials:true,
            })
            return data;
        } catch (error) {
            if(axios.isAxiosError(error)){
                return rejectWithValue(error.response?.data?.message)
            }
            return rejectWithValue("something went wrong")
        }
    }
)

// 5. Forgot Password Api call for user
export const userForgotPassword = createAsyncThunk<any,string,{rejectValue:string}>(
    'user/forgot',
    async( email, {rejectWithValue})=>{
        try {
            const { data } = await axios.post(`${baseuri}/forgot-password`,{email},{
                headers:{'Content-Type':'application/json'},
                withCredentials:true,
            })
            return data;
        } catch (error) {
            if(axios.isAxiosError(error)){
                return rejectWithValue(error.response?.data?.message)
            }
            return rejectWithValue("something went wrong")
        }
    }
)

// 6. Verify otp api call for user
export const userVerifyOtp = createAsyncThunk<any,string,{rejectValue:string}>(
    'user/verifyotp',
    async( otp , {rejectWithValue})=>{
        try {
            const { data } = await axios.post(`${baseuri}/verify-otp`,{otp},{
                headers:{'Content-Type':'application/json'},
                withCredentials:true,
            })
            return data;
        } catch (error) {
            if(axios.isAxiosError(error)){
                return rejectWithValue(error.response?.data?.message)
            }
            return rejectWithValue("something went wrong")
        }
    }
)

// 7. User Reset Password api call for user
export const userResetPassword = createAsyncThunk<any,string,{rejectValue:string}>(
    'user/Reset',
    async( password, {rejectWithValue})=>{
        try {
            const { data } = await axios.patch(`${baseuri}/reset-password`,{password},{
                headers:{'Content-Type':'application/json'},
                withCredentials:true,
            })
            return data;
        } catch (error) {
            if(axios.isAxiosError(error)){
                return rejectWithValue(error.response?.data?.message)
            }
            return rejectWithValue("something went wrong")
        }
    }
)