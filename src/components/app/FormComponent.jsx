'use client';
import React, { useCallback, useEffect } from 'react'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import { TbCircleDot } from "react-icons/tb";
import { useSelector } from 'react-redux';
import { getColor, getcolorflat } from '@/app/theme';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setLeftMapCreate, setLoadAnimate, setMessageAndUrl, setRightMapCreate, setRouteDriveData, setTaskId } from '@/app/GlobalRedux/reducers/app/Main';
import { ToastContainer, toast, Slide } from 'react-toastify';
import debounce from "lodash/debounce";

export default function FormComponent() {
    const {theme, taskId} = useSelector((state) => state.main);
    const dispatch = useDispatch();
    const [color, setColor] = React.useState(null);
    const [flatcolor, setFlatColor] = React.useState(null);
    const [locations, setLocations] = React.useState([]);
    const taskIdRef = React.useRef(taskId);
    const [searchInput, setSearchInput] = React.useState(false);
    const [query, setQuery] = React.useState("");

    // add location to state

    const [currentLocation, setCurrent] = React.useState(null);
    const [pickupLocation, setPickup] = React.useState(null);
    const [dropoffLocation, setDropoff] = React.useState(null);

    // value parameters
    const [cycle, setCycle] = React.useState("");
    const [currentValue, setCurrentValue] = React.useState("")
    const [pickupValue, setPickupValue] = React.useState("")
    const [dropoffValue, setDropoffValue] = React.useState("")

    // set button disable
    const [disable, setDisable] = React.useState(false);


    useEffect(() => {
        if (taskId === "null"){
            getTask();
        }
        setColor(getColor(theme, "color"));
        setFlatColor(getcolorflat(theme, "color"));
    }, [])

    // get task

    const getTask = async () => {
        const response = await axios.get(`https://trucktrack.publicvm.com/api/trip/generate_task/`);
        dispatch(setTaskId(response.data.task_id));
        connectWebSocket(response.data.task_id);
    }

    useEffect(() => {
        taskIdRef.current = taskId;
    }, [taskId]);

    // connect Websocket

    const connectWebSocket = (taskID) => {
        if (taskID === "null") return;
        const socket = new WebSocket(`wss://trucktrack.publicvm.com/ws/api/check/proccess/${taskID}/`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "info") {
                // Display incoming info messages on the screen
                dispatch(setMessageAndUrl({ message: data.message, url: data.url }));
            } else if (data.status === "completed") {
                // If the task is complete, process route and log data
                data.route_data && setLocations(data.route_data);
                data.driver_log && dispatch(setRouteDriveData({ route_data: data.route_data, driver_log: data.driver_log }));
                setDisable(false);
            }
        };

        return () => socket.close();
    };


    // notify

    const notify = () => toast('Please enter numbers', {

        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
        transition: Slide,
    });


    // create trip
    const createTrip = async () => {
        dispatch(setLoadAnimate(true));
        setDisable(true);
        await axios.post("https://trucktrack.publicvm.com/api/trip/create/", {
            serializer: {
                start_location: currentLocation.location_name,
                pickup_location: pickupLocation.location_name,
                dropoff_location: dropoffLocation.location_name,
                hours_available: 8.0,  // Sayısal değer
                distance: 500.0,        // Sayısal değer
                estimate_time: 6.0      // Sayısal değer
            },
            start_lat: pickupLocation.location_lat,
            start_lon: pickupLocation.location_lon,
            end_lat: dropoffLocation.location_lat,
            end_lon: dropoffLocation.location_lon,
            ccu: cycle,
            task_id: taskId
        });
    };

    // handle , search inputs
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            await axios.get(`https://trucktrack.publicvm.com/api/trip/search/?q=${query}&task_id=${taskIdRef.current}`);
        }, 300),
        []
    )
    const searchHandler = (event) => {
        const action = event.target.id;
        const q = event.target.value;
        setSearchInput(action)
        setQuery(q)
        action === "current" ? setCurrentValue(q) :
            action === "pickup" ? setPickupValue(q) :
                action === "dropoff" ? setDropoffValue(q) : ""
    }
    useEffect(() => {
        if (query !== "") {
            debouncedSearch(query);
        }
    }, [query, debouncedSearch]);

    // validate setCycle
    const isValidInteger = (str) => {
        return !isNaN(str) && Number.isInteger(Number(str));
    };
    const validateCycle = (data) => {
        if (isValidInteger(data)) {
            setCycle(data)
        } else {
            notify()
        }
    }

    // validate form

    const validateForm = () => {
        if (!cycle.trim()) return false;  // cycle boş olamaz
        if (!currentLocation) return false; // Lokasyon seçilmeli       // 117,712 + 
        if (!pickupLocation) return false;  // Alış noktası gerekli 
        if (!dropoffLocation) return false; // Bırakma noktası gerekli  // x 25,920 - y 117,712 w: 6,995 h: 7,299 ---------    25,920 + 6,995 / 2 + 0,265    ----    117,712 + 7,299 / 2 + 0,265
        if (disable) return false;
        return true; // Tüm kontroller geçtiyse form geçerli
    };

    // list search query list

    const listItem = () => {
        return (
            <Box className="absolute left-0 top-13 w-full max-h-[200px] rounded-2xl z-10 overflow-y-auto"
                sx={{
                    border: `2px solid ${getColor(theme, "color")}`,
                    bgcolor: getColor(theme, 'bgcolor'),

                }}
            >
                <List>
                    {locations.map((item, index) => (
                        <ListItem
                            key={index}
                            sx={{ cursor: "pointer", color: getColor(theme, "color") }}
                            onClick={() => { locationDirection(item) }}
                        >
                            <Typography sx={{ fontSize: "13px", borderBottom: `1px solid ${getColor(theme, "color")}` }}>
                                {item.display_name}
                            </Typography>
                        </ListItem>
                    ))}

                </List>
            </Box>
        );
    }

    // set direction lot, lat
    const locationDirection = (location) => {
        searchInput === "current" ?
            (setCurrent({ location_name: location.display_name, location_lat: location.lat, location_lon: location.lon }), setCurrentValue(location.display_name), dispatch(setLeftMapCreate([location.lat, location.lon]))) :
            searchInput === "pickup" ?
                (setPickup({ location_name: location.display_name, location_lat: location.lat, location_lon: location.lon }), setPickupValue(location.display_name), dispatch(setLeftMapCreate([location.lat, location.lon]))) :
                searchInput === "dropoff" ?
                    (setDropoff({ location_name: location.display_name, location_lat: location.lat, location_lon: location.lon }), setDropoffValue(location.display_name), dispatch(setRightMapCreate([location.lat, location.lon]))) : ""
        setSearchInput("")
    }

    return (
        <div className='flex flex-col justify-between items-center gap-2 max-w-[400px]'>
            <ToastContainer />
            <div className="flex justify-between items-center gap-2 w-full">
                <Paper
                    component="form"
                    variant='outlined'
                    className='relative'
                    sx={{ bgcolor: 'transparent', border: `2px solid ${color}`, p: '2px 4px', display: 'flex', alignItems: 'center', width: "40%", borderRadius: "20px" }}
                >
                    <span className='absolute right-0 -top-5 text-xs' style={{ fontFamily: 'Palatino Linotype', letterSpacing: "1px" }}>Hours</span>
                    <InputBase
                        sx={{ ml: 1, flex: 1, fontFamily: 'Palatino Linotype' }}
                        placeholder="Cycle"
                        value={cycle}
                        onChange={e => validateCycle(e.target.value.trim())}
                        inputProps={{ 'aria-label': 'search openstreetmap maps' }}
                    />
                    <IconButton disabled type="button" sx={{ py: '10px', color: color }} aria-label="search">
                        <SearchIcon sx={{ opacity: 0, width: 0 }} />
                    </IconButton>
                </Paper>
                <div className='relative w-full'>

                    <Paper
                        component="form"
                        variant='outlined'
                        sx={{ bgcolor: 'transparent', border: `2px solid ${color}`, p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: "20px" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1, fontFamily: 'Palatino Linotype' }}
                            placeholder="Search current location"
                            id='current'
                            value={currentValue}
                            onChange={searchHandler}
                            inputProps={{ 'aria-label': 'search openstreetmap maps' }}

                        />
                        <Divider sx={{ height: 28 }} orientation="vertical" />
                        <IconButton type="button" sx={{ p: '10px', color: color }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    {searchInput === "current" && locations.length > 0 && listItem()}
                </div>
            </div>
            <div className='relative w-full'>


                <Paper
                    component="form"
                    variant='outlined'
                    sx={{ bgcolor: 'transparent', border: `2px solid ${color}`, display: 'flex', alignItems: 'center', width: "100%", borderRadius: "20px" }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1, fontFamily: 'Palatino Linotype' }}
                        placeholder="Search  pickup location"
                        value={pickupValue}
                        id='pickup'
                        onChange={searchHandler}
                        inputProps={{ 'aria-label': 'search openstreetmap maps' }}
                    /><Divider sx={{ height: 28 }} orientation="vertical" />
                    <IconButton type="button" sx={{ p: '10px', color: color }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
                {searchInput === "pickup" && locations.length > 0 && listItem()}
            </div>
            <div className='relative w-full'>
                <Paper
                    component="form"
                    variant='outlined'
                    sx={{ bgcolor: 'transparent', border: `2px solid ${color}`, display: 'flex', alignItems: 'center', width: "100%", borderRadius: "20px" }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1, fontFamily: 'Palatino Linotype' }}
                        placeholder="Search dropoff location"
                        id='dropoff'
                        value={dropoffValue}
                        onChange={searchHandler}
                        inputProps={{ 'aria-label': 'search openstreetmap maps' }}
                    />
                    <Divider sx={{ height: 28 }} orientation="vertical" />
                    <IconButton type="button" sx={{ p: '10px', color: color }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
                {searchInput === "dropoff" && locations.length > 0 && listItem()}
                <div className="relative w-full pt-2">
                    {validateForm() && <TbCircleDot className='absolute top-2 right-5 animate-ping  z-1' color={flatcolor} size={20} />}
                    <Button
                        onClick={createTrip}
                        disabled={!validateForm()}
                        sx={{
                            width: "100%", p: 2, borderRadius: 40, letterSpacing: 4, color: flatcolor,
                            "&.Mui-disabled": {
                                color: flatcolor
                            }
                        }}
                        variant="contained"
                    >
                        Check
                    </Button>
                </div>
            </div>
        </div>
    )
}
