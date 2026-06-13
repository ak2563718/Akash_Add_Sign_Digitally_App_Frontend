import { createSlice } from "@reduxjs/toolkit"; 
import { previewPdf, uploadpdf } from "./files.Action";


interface filedata{
    files:any,
    loading:boolean,
    message:String| null,
    error:String | null,
}

const initialState:filedata ={
    files:{},
    loading:false,
    message:null,
    error: null,
}

const fileSlice = createSlice({
    name:'file',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        // 1. Upload file Slice
        builder.addCase(uploadpdf.pending,(state)=>{
            state.loading = true;
            state.files = {};
            state.message = null;
            state.error = null;
        }).addCase(uploadpdf.fulfilled,(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.files = action.payload.file;
        }).addCase(uploadpdf.rejected,(state, action)=>{
            state.loading = false;
            state.error = action.payload ?? null;
        });

        // 2. preview file slice
        builder.addCase(previewPdf.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.message = null;
            state.files = {};
        }).addCase(previewPdf.fulfilled,(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.files = action.payload.file;
        }).addCase(previewPdf.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload ?? null;
        })
    }
})

export default fileSlice.reducer;