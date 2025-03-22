'use client';
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { BsFillFuelPumpDieselFill } from 'react-icons/bs';
import { GiNightSleep } from "react-icons/gi";
import { MdFreeBreakfast } from "react-icons/md";
import { FaFlag } from "react-icons/fa";
import { useSelector } from 'react-redux';

const startIconSvg = renderToString(<FaFlag color="#4CAF50" />);
const endIconSvg = renderToString(<FaFlag color="#FF0000" />);
const fuelIconSvg = renderToString(<BsFillFuelPumpDieselFill color='#FF5733' />);
const sleeperIconSvg = renderToString(<GiNightSleep color='#3498DB' />);
const breakIconSvg = renderToString(<MdFreeBreakfast color='#DC6B19' />);
// Özel ikonlar tanımlama

const startIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(startIconSvg)}`,
    iconSize: [15, 15],
    iconAnchor: [12, 12],
});

// Bitiş ikonu
const endIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(endIconSvg)}`,
    iconSize: [15, 15],
    iconAnchor: [12, 12],
});
const breakIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(breakIconSvg)}`,
    iconSize: [15, 15],
    iconAnchor: [12, 12],
});

const sleeperIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(sleeperIconSvg)}`,
    iconSize: [15, 15],
    iconAnchor: [12, 12],
});

const fuelingIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(fuelIconSvg)}`,
    iconSize: [15, 15],
    iconAnchor: [12, 12],
});

const MapComponent = ({ routeData, driving_log }) => {
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const mapInstance = useRef("");
    const { theme } = useSelector(state => state.main)

    useEffect(() => {
        if (routeData && routeData.routes && routeData.routes[0]) {
            const coordinates = routeData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setRouteCoordinates(coordinates);
        }
    }, [routeData]);

    useEffect(() => {
        if (mapInstance.current && routeCoordinates.length > 0) {
            const bounds = L.latLngBounds(routeCoordinates);
            mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [routeCoordinates]);


    const direction = () => {
        return (
            <>

                {
                    routeCoordinates.length > 0 && (
                        <Polyline positions={routeCoordinates} color="blue" />
                    )
                }

                {
                    routeCoordinates.length > 0 && (
                        <>
                            <Marker position={routeCoordinates[0]} icon={startIcon}>
                                <Popup>Başlangıç Noktası</Popup>
                            </Marker>
                            <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={endIcon}>
                                <Popup>Bitiş Noktası</Popup>
                            </Marker>
                        </>
                    )
                }

                {
                    driving_log && driving_log.schedule.map((step, index) => {
                        if (step.mode === "Off Duty (Break)" || step.mode === "Sleeper Berth" || step.mode === "On Duty (Fueling)") {
                            const icon = step.mode === "Off Duty (Break)"
                                ? breakIcon
                                : step.mode === "Sleeper Berth"
                                    ? sleeperIcon
                                    : fuelingIcon;

                            return (
                                <Marker
                                    key={index}
                                    position={[step.location[1], step.location[0]]}
                                    icon={icon}
                                >
                                    <Popup>
                                        {`${step.mode}<br>${step.start_time} - ${step.end_time}`}
                                    </Popup>
                                </Marker>
                            );
                        }
                        return null;
                    })
                }
            </>
        )
    }

    return (
        <MapContainer
            center={[0, 0]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            ref={mapInstance}
        >
            <TileLayer
                url={theme === "dark" ? "https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=19ae075bf2504280977172a948397f2c" : "https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=19ae075bf2504280977172a948397f2c"}
            />

            {direction()}
        </MapContainer>
    );
};

export default MapComponent;