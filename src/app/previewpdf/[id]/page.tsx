'use client'
import PreviewPdf from "@/components/pages/PdfPreview";
import { useParams } from "next/navigation";

export default function PreviewPdfPage(){
    const params = useParams<any>()
    return(
        <>
        <PreviewPdf searchby={params.id}/>
        </>
    )
}