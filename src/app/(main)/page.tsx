import { Navbar } from '@/components/pages/Navbar';
import  Home  from '../../components/pages/Home';
import { Footer } from '@/components/pages/Footer';
import { PdfUpload } from '@/components/pages/PdfUpload';

export default function MainPage(){
  return(
    <>
    <Navbar/>
    <div className='w-full h-screen flex mt-20'>
       <PdfUpload/>
    </div>
    <Footer/>
    </>
  )
}