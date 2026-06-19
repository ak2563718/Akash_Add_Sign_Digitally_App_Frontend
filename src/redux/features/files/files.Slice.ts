import { createSlice } from "@reduxjs/toolkit"; 
import { addSignaturetopdf, getShareLink, previewPdf, uploadpdf } from "./files.Action";


interface filedata{
    files:any,
    loading:boolean,
    message:String| null,
    error:String | null,
    isDownload:boolean,
    downloadurl:string|null,
    sharableLink:string|null,
}

const initialState:filedata ={
    files:{},
    loading:false,
    message:null,
    error: null,
    isDownload:false,
    downloadurl:null,
    sharableLink:null,
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
        });

        // 3. Add Signature to pdf
        builder.addCase(addSignaturetopdf.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.isDownload = false;
            state.message = null;
        }).addCase(addSignaturetopdf.fulfilled,(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.isDownload = true;
            state.downloadurl = action.payload.pdf.fileurl;
        }).addCase(addSignaturetopdf.rejected,(state,action)=>{
            state.loading = false;
            state.isDownload = false;
            state.error = action.payload ?? null;
        });

        // 4. Get Shareable link
        builder.addCase(getShareLink.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.message = null;
            state.sharableLink = null;
        }).addCase(getShareLink.fulfilled,(state,action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.sharableLink = action.payload.link;
        }).addCase(getShareLink.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload ?? null;
        })
    }
})

export default fileSlice.reducer;