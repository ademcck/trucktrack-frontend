'use client';
import { Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { getColor, getcolorflat } from '@/app/theme';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { IoIosMenu } from "react-icons/io";
const LogoDark = "/assets/svg/logo/logo_dark.svg";
const LogoLight = "/assets/svg/logo/logo_light.svg";

export default function HeaderComponent() {
    const theme = useSelector((state) => state.main.theme);
    const [flatColor, setFlatColor] = React.useState("");
    const [bgColor, setBgColor] = React.useState("");
    const [selectedColor, setSelectedColor] = React.useState("");
    const [passiveColor, setPassiveColor] = React.useState("");
    const [position, setPosition] = React.useState("");
    const [accountPosition, setAccountPosition] = React.useState("");
    const acountRef = useRef(null);
    const menuList = useRef(["How it works?", "Pricing", "Blog", "Contact"]);
    const [open, setOpen] = React.useState(false);
    const [isMobile, setMobile] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    useEffect(() => {
        setFlatColor(getcolorflat(theme, "color"));
        setPassiveColor(getColor(theme, "color"));
        setSelectedColor(getcolorflat(theme, "color"));
        setBgColor(getColor(theme, "color"));
    }, [])

    useEffect(() => {
        acountRef.current.addEventListener("mouseover", (e) => {
            e.target.id === "login" ?
                (setPosition("right"), setSelectedColor(getcolorflat(theme, "color")), setPassiveColor(getColor(theme, "color")))
                : e.target.id === "register" ?
                    (setPosition("left"), setSelectedColor(getColor(theme, "color")), setPassiveColor(getcolorflat(theme, "color"))) : ""
        })
    }, [])

    const forDesktop = () => {
        return (
            <List className='grid md:grid-cols-4 grid-cols-1 ' sx={{ color: flatColor }}>
                {
                    menuList.current.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={item}
                                primaryTypographyProps={{ sx: { fontFamily: 'Palatino Linotype', letterSpacing: "2px", whiteSpace: "nowrap" } }}
                            />
                        </ListItem>

                    ))
                }
            </List>
        )
    }

    const forMobile = () => {
        return (
            <List sx={{ color: flatColor }}>

                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <IoIosMenu size={20} color={flatColor} />
                    </ListItemIcon>
                    <ListItemText primary="Menu" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {
                            menuList.current.map((item, index) => (
                                <ListItemButton key={index} sx={{ pl: 4 }}>
                                    <ListItemText primary={item} primaryTypographyProps={{ sx: { fontFamily: 'Palatino Linotype', letterSpacing: "2px" } }} />
                                </ListItemButton>
                            ))
                        }
                        {/* <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Starred" />
                    </ListItemButton> */}
                    </List>
                </Collapse>
            </List>
        )
    }

    useEffect(() => {
        const handleResize = () => {
            setMobile(window.innerWidth <= 850);
            setAccountPosition(window.innerWidth <= 470);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    return (
        <div
            style={{
                backgroundColor: bgColor,
                padding: accountPosition ? "10px" : "10px 2em",
                display: 'flex',
                flexDirection: accountPosition ? 'column' : 'row',
                alignItems: accountPosition ? "stretch" : 'center',
                justifyContent: 'space-between'
            }}>
            <div className='flex items-center gap-2 '
                style={{
                    justifyContent: accountPosition ? 'space-between' : 'normal'
                }}
            >
                <img
                    src={theme === "dark" ? LogoLight : LogoDark}
                    width={70}
                    height={70}
                    alt="Logo"
                />
                {
                    isMobile ? (
                        forMobile()
                    ) : (
                        forDesktop()
                    )
                }
            </div>
            <Box>
                <div ref={acountRef} className='relative w-[150px] h-[30px] rounded-full'
                    style={{
                        backgroundColor: flatColor,
                        fontFamily: 'Century Gothic',
                        letterSpacing: '1px',
                    }}>
                    <div
                        className='absolute w-[75px] h-[27px] rounded-full top-1/2 transform -translate-y-1/2'
                        style={{
                            left: position === "left" ? "calc(100% - 77px)" : "2px", // Sol veya sağ pozisyon
                            backgroundColor: bgColor,
                            transition: "left 0.2s ease-in-out", // Sadece `left` özelliğine animasyon ekleyin
                        }}
                    ></div>
                    <div className='flex justify-between items-center w-full h-full'>
                        <a
                            id="login"
                            href="#login"
                            className='w-full text-center z-10 text-xs'
                            style={{
                                color: selectedColor,
                                cursor: 'pointer',
                                transition: "all 0.2s ease-in-out"
                            }}
                        >
                            Login
                        </a>
                        <a
                            id="register"
                            href="#register"
                            className='w-full text-center z-10 text-xs'
                            style={{
                                color: passiveColor,
                                cursor: 'pointer',
                                transition: "all 0.2s ease-in-out"
                            }}
                        >
                            Register
                        </a>
                    </div>
                </div>
            </Box>
        </div>
    )
}
