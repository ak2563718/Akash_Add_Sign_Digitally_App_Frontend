'use client'
import Share from "@/components/pages/Share";
import { useState } from "react";


export default function TestPage(){
    const [ add, setAdd] = useState(false)
    return(
        <>
        <Share isopen={add} onClose={()=>setAdd(false)}/>
        </>
    )
}