'use client';
import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import FormComponent from './FormComponent'
import { useSelector } from 'react-redux';
import { getColor } from '@/app/theme';
import RightPanelComponent from './RightPanelImage'
import '@/styles/css-component/animation.css';
import '@/styles/css-component/appcomponent.css'
import Loading from './Loading';

const MapComponent = dynamic(() => import('@/components/app/GetMap'), { ssr: false });
const RightMap = dynamic(() => import('@/components/app/GetRightMap'), { ssr: false });
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function AppComponent() {
    const { theme, route_data, driver_log, leftMapCreate, rightMapCreate, load_animate } = useSelector((state) => state.main);
    const [animationData, setAnimationData] = useState(null);
    const [isMobile, setMobile] = React.useState(false);

    useEffect(() => {
        if (animationData === null) {
            fetch("/assets/lottie/truck.json")
                .then((res) => res.json())
                .then((data) => setAnimationData(data))
                .catch((err) => console.error("Lottie yüklenirken hata oluştu:", err));

        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMobile(false);
            } else {
                setMobile(true);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className='relative w-full h-full flex flex-col justify-between items-center' >
            {load_animate && <div className='absolute w-[90%] h-[90%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10000'>
                <Loading />
            </div>}
            <div className=' w-full h-full grid md:grid-cols-3 xs:grid-cols-1 gap-4'>
                <div className='order-3 shadow-drop-br md:order-none h-full bg-emerald-900 overflow-hidden'
                    style={{
                        borderRadius: isMobile ? "1em" : "0 3em 3em 3em",
                        width: isMobile ? "95%" : "100%",
                        margin: "auto"
                    }}
                    id="startMap">
                    {
                        driver_log ? <MapComponent routeData={route_data} driving_log={driver_log} /> : leftMapCreate ? <RightMap location={leftMapCreate} /> : <RightMap location={[41.0211, 29.0041]} />
                    }

                </div>
                <div className='order-1 md:order-none  w-full flex   justify-center items-center h-[400px]' id="formLog">
                    <FormComponent />
                </div>
                <div className='order-2 md:order-none shadow-drop-bl h-full overflow-hidden  min-h-[200px] bg-blue-950'
                    style={{
                        borderRadius: isMobile ? "1em" : "3em 0  3em 3em",
                        width: isMobile ? "95%" : "100%",
                        margin: "auto"
                    }}
                    id="logImageOrEndMap">

                        
                    {rightMapCreate ? <RightMap location={rightMapCreate} />: <RightPanelComponent />}
                </div>
            </div>
            <div className='relative w-full grid md:grid-cols-3 xs:grid-cols-1 overflow-hidden'>
                <div className='p-10  text-xs' style={{ letterSpacing: '1px', fontFamily: 'Century Gothic' }}>
                    <p>
                        Route planning, rest stops and fuel stops for truck drivers according to European standards. Start now for a safe and efficient journey!
                    </p>
                </div>
                <div className='p-10 text-xs ' style={{ letterSpacing: '1px', fontFamily: 'Century Gothic' }}>
                    <h3 className='w-full text-center text-sm mb-2' style={{ fontFamily: 'Cooper Black', letterSpacing: '2px' }}>What Do We Offer?</h3>
                    <p>
                        - Determine the fastest and safest routes. We offer optimized routes taking into account traffic, weather and road conditions.
                    </p>
                    <p>

                        - Rest stops are automatically scheduled in accordance with European standards. Prevent fatigue, ensure your safety.
                    </p>
                    <p>

                        - Identify the most convenient stops for refueling. Reduce your costs by saving fuel.
                    </p>
                    <p className='text-end opacity-65'>

                        and much more...
                    </p>

                </div>
                <div
                    style={{
                        height: isMobile ? "content" : "100%",
                        display: isMobile ? 'contents' : 'flex',
                        alignItems: 'end'
                    }}
                >

                    <div className='mb-10 rounded-bl-full rounded-tl-full relative w-full h-[30]' style={{ backgroundColor: getColor(theme, "color") }}>
                        <div id='truck-lottie' className='w-full'>
                            <Lottie animationData={animationData} loop={true} autoplay={true} style={{ width: "300px", }} />
                        </div>
                        <div className="relative w-full h-full rounded-bl-full rounded-tl-full" style={{ overflow: "hidden" }}>

                            <div className='road-line w-full absolute top-0 right-0 flex justify-start border-2 rounded-full  '  >
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
