import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseuri = 'http://localhost:3300/api/doc';

// 1. Upload pdf file api call
export const uploadpdf = createAsyncThunk<any, any, { rejectValue: String}>(
    'pdf/post',
    async( file, { rejectWithValue} )=>{
        try{
            const { data } = await axios.post(`${baseuri}/uploadfile`, file, {
                headers:{'Content-Type': 'multipart/form-data'},
                withCredentials:true,
            })
            return data;
        }catch(error){
            if(axios.isAxiosError(error)){
                return rejectWithValue(error.response?.data?.message)
            }
            return rejectWithValue("something went wrong")
        }
    }
)

// 2. Preview pdf file api call
export const previewPdf = createAsyncThunk<any, string, {rejectValue:String}>(
    'pdf/get',
    async( id , {rejectWithValue})=>{
        try {
            const { data } = await axios.get(`${baseuri}/previewfile/${id}`,{
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