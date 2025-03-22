import React from 'react'
import { useSelector } from 'react-redux';
import { getColor } from '@/app/theme';

export default function RightPanelImage() {

  return (
    <div className=' relative w-full h-full'>
        <div className="kenburns-top w-full h-full bg-[url(/assets/images/landscape.jpg)] bg-center  bg-no-repeat bg-cover"></div>
        <div className="kenburns-bottom absolute bottom-0 w-full h-full left-1/2 transform -translate-x-1/2 bg-[url(/assets/images/road.png)] bg-center  bg-no-repeat bg-cover" ></div>
        <div className="slide-left absolute bottom-0 w-[50%] h-full -right-15 bg-[url(/assets/images/station.png)] bg-center  bg-no-repeat bg-contain" style={{ filter: "grayscale(50%) contrast(100%)" }}></div>
        <div className="scale-up-center absolute -bottom-10 w-[50%] h-full left-1/3 transform -translate-x-1/3 bg-[url(/assets/images/truck2.png)] bg-center  bg-no-repeat bg-contain" style={{ filter: "grayscale(30%) contrast(100%)" }}></div>
        <div className="slide-top absolute bottom-10 w-[50%] h-[80%] right-0 bg-[url(/assets/images/tree.png)] bg-center  bg-no-repeat bg-cover" style={{ filter: "grayscale(30%) contrast(100%)" }}></div>
        <h3 className='tracking-in-expand absolute font-[src(/assets/fonts/cooper-black/CooperBlack.ttf)] w-full p-10 bottom-10 left-1/2 transform -translate-x-1/2 text-center text-xl font-bold tracking-[2px]' style={{ fontFamily: "Cooper Black", color: getColor("dark", "color"), filter: `drop-shadow(0 0 2px ${getColor("dark", "bgcolor")})`  }}>Track Every Moment!</h3>
        <p className='tracking-in-contract-bck-bottom absolute w-full p-10 bottom-0 left-1/2 transform -translate-x-1/2 text-center text-xs' style={{ fontFamily: "Century Gothic", color: getColor("dark", "color"), filter: `drop-shadow(0 0 2px ${getColor("dark", "bgcolor")})` }}>Take your transportation to the next level with real-time map integration, detailed driving records and scheduled breaks. </p>
    </div>
  )
}
