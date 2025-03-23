import React, { useState } from 'react'
import dynamic from "next/dynamic";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getColor } from '@/app/theme';
import { PiFilePdfDuotone } from "react-icons/pi";
import { Button } from '@mui/material';
import { MdOutlineExitToApp } from "react-icons/md";
import { setLoadAnimate } from '@/app/GlobalRedux/reducers/app/Main';

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
export default function Loading() {
    const [animationData, setAnimationData] = useState(null);
    const dispatch = useDispatch();
    const { message, url } = useSelector((state) => state.main);

    useEffect(() => {
        if (animationData === null) {
            fetch("/assets/lottie/truck_getting.json")
                .then((res) => res.json())
                .then((data) => setAnimationData(data))
                .catch((err) => console.error("Lottie yüklenirken hata oluştu:", err));

        }
    }, []);
    const handleDownload = async () => {
        const baseUrl = "https://trucktrack.publicvm.com/media";
        const pdfUrl = baseUrl + url;
    
        try {
            // Fetch the file
            const response = await fetch(pdfUrl);
            if (!response.ok) {
                throw new Error("File not found or inaccessible.");
            }
    
            // Get the response as a blob
            const blob = await response.blob();
    
            // Create a downloadable URL from the blob
            const blobUrl = window.URL.createObjectURL(blob);
    
            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'route.pdf'; // Name of the file to be downloaded
    
            // Trigger the download
            document.body.appendChild(link);
            link.click();
    
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl); // Free up the blob URL
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    return (
        <div className='relative flex flex-col justify-center items-center w-full h-full' style={{
            background: "rgba(255, 255, 255, 0.06)",
            borderRadius: "16px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(8.6px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            WebkitBackdropFilter: "blur(8.6px)"
        }}>

            <Lottie animationData={animationData} loop={true} autoplay={true} style={{ width: "300px", }} />
            <span className=' mt-5 text-xs' style={{ color: getColor("light", "color"), fontFamily: "Cooper Black", transition: "all 0.5s ease-in-out", letterSpacing: "2px" }}>{message}</span>

            {url && <Button onClick={handleDownload} variant="contained" ><PiFilePdfDuotone size={20} />Click And Download</Button>}
            {url && <div className='absolute top-5 right-5'><MdOutlineExitToApp size={30} className='cursor-pointer' onClick={() => dispatch(setLoadAnimate(false))} /></div>}
        </div>
    )
}
