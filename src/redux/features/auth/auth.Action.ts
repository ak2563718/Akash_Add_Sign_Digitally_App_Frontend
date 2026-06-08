import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseuri = 'http://localhost:3000/api/auth'

interface loginData{
    email:string,
    password:string
}
interface signuData{
    name:string,
    email:string,
    username:string,
    passwrod:string,
}
export const userLogin = createAsyncThunk(
    'user/login',
    async( info:loginData, { rejectWithValue })=>{
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