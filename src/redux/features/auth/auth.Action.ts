import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseuri = 'http://localhost:3300/api/auth'

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
interface forgotData{
    email:string,
}
interface otpData{
    otp:string
}
interface passData{
    password:string
}

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

export const userLogout = createAsyncThunk(
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

export const userSession = createAsyncThunk<any,null,{rejectValue:string}>(
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

export const userForgotPassword = createAsyncThunk<any,forgotData,{rejectValue:string}>(
    'user/forgot',
    async( email, {rejectWithValue})=>{
        try {
            const { data } = await axios.post(`${baseuri}/fogot-password`,email,{
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
export const userVerifyOtp = createAsyncThunk<any,otpData,{rejectValue:string}>(
    'user/verifyotp',
    async( otp , {rejectWithValue})=>{
        try {
            const { data } = await axios.post(`${baseuri}/verifyotp`,otp,{
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
export const userResetPassword = createAsyncThunk<any,passData,{rejectValue:string}>(
    'user/Reset',
    async( password, {rejectWithValue})=>{
        try {
            const { data } = await axios.post(`${baseuri}/reset-password`,password,{
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