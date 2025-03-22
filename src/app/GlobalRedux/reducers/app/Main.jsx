'use client';
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    
    theme: "light",

    // map data
    route_data: null,
    driver_log: null,
    // app right panel
    leftMapCreate: false,
    rightMapCreate: false,
    
    // message
    message: [],
    url : null,

    // animation Loading
    load_animate: false

};

export const MainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        setThema: (state, action) => {
            state.theme = action.payload;
        },

        setRouteDriveData : (state, action) => {
            const { route_data, driver_log } = action.payload
            console.log(route_data, driver_log)
            state.route_data = route_data;
            state.driver_log = driver_log;
        },
        setRightMapCreate: (state, action) => {
            state.rightMapCreate = action.payload;
        },
        setLeftMapCreate: (state, action) => {
            state.leftMapCreate = action.payload;
        },

        setMessageAndUrl: (state, action) => {
            const { message, url } = action.payload;
            state.message = message;
            if (url !== undefined){ 
                state.url = url;
            }
        },
        setLoadAnimate: (state, action) => {
            state.load_animate = action.payload;
        },
  
    },
});


export const { setMessageAndUrl, setLoadAnimate, setLeftMapCreate, setRightMapCreate, setMapCreate, setRouteDriveData, setLonLat } = MainSlice.actions;
export default MainSlice.reducer;