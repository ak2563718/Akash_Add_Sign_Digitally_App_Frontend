import UploadSign from "@/components/pages/UploadSign";
import { useParams } from "next/navigation";

export default function UploadSignPage(){
    const param = useParams<any>()
    return(
        <>
        <UploadSign searchby={param.id}/>
        </>
    )
}