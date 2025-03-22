'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { getColor } from '@/app/theme';



const RecenterMap = ({ location }) => {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.setView(location, 13, { animate: true });
        }
    }, [location, map]);
    return null;
};

const MapComponent = ({ location }) => {
    const { theme } = useSelector(state => state.main);
    const [locationIcon, setIcon] = useState(null)

    useEffect(() => {
        const locationIconSvg = renderToString(<FaLocationDot color={getColor(theme, "color")} />);
        setIcon(new L.Icon({
            iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(locationIconSvg)}`,
            iconSize: [20, 20],
            iconAnchor: [12, 12],
        }))
    }, [theme]) 
    return (
        <MapContainer
            center={location}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url={theme === "dark"
                    ? "https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=19ae075bf2504280977172a948397f2c"
                    : "https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=19ae075bf2504280977172a948397f2c"}
            />

            <RecenterMap location={location} />

            <Marker position={location} icon={locationIcon}>
                <Popup>Konum</Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;
