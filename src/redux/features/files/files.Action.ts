import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



const baseuri = 'https://akash-add-sign-digitally-app-backend.onrender.com/api/doc';

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


// 3. Add Signature to the pdf
export const addSignaturetopdf = createAsyncThunk<any,any,{rejectValue:String}>(
    'pdf/signature',
    async(payload, {rejectWithValue})=>{
        try {
            const { data } = await axios.post(`${baseuri}/uploadsign`,payload,{
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


// 4. Get Shareable url
export const getShareLink = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>(
  "post/createlink",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${baseuri}/createlink/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
        if (error.response?.status === 401) {
            console.log('status code',error.response?.status)
          window.location.href = "/login";
          return rejectWithValue("Unauthorized");
        }

        return rejectWithValue(
          error.response?.data?.message || "Something went wrong"
        );
      }

      return rejectWithValue("Something went wrong");
    }
  }
);