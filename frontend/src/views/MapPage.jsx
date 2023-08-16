import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { getPlaces } from "../hooks/places.api";

mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN;
export function MapPage() {
    const mapContainerRef = useRef(null);
    let { placeID } = useParams();
    const [map, setMap] = useState(null);
    const [searchId, setSearchId] = useState(placeID || "");
    const [coords, setCoords] = useState([-76.532, 3.4516]);
    const [scale, setScale] = useState(12);
    const [place, setPlace] = useState(null);
    const [show, setShow] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [mapMarkers, setMapMarkers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [placeholderText, setPlaceholderText] = useState("Search a place");
    const [suggestedResults, setSuggestedResults] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {

        if (!map) {
            setMap(
                new mapboxgl.Map({
                    container: mapContainerRef.current,
                    style: "mapbox://styles/mapbox/streets-v9",
                    center: coords,
                    zoom: scale,
                })
            );
        }
    }, [coords, map, scale]);

    async function searchHandler() {
        if (searchId != null) {
            setShow(true);
            let endp;
            if (isNaN(searchId)) {
                // If searchId is not a number, assume it's a name
                endp = `http://127.0.0.1:8000/places/api/places/?search=${searchId}`;
            } else {
                endp = `http://127.0.0.1:8000/places/api/places/${searchId}/`;
            };
            await axios({
                method: "get",
                url: endp,
            })
                .then(async function (response) {
                    console.log(response.data);
                    setPlace(response.data);
                    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${place.address.replace(
                        /[-#,]/g,
                        " "
                    )}.json?access_token=${mapboxgl.accessToken}`;
                    const resp = await fetch(endpoint);
                    const result = await resp.json();
                    console.log(result.features[0].geometry.coordinates);
                    setCoords(result?.features[0].geometry.coordinates);
                    setScale(20);
                    setShow(false);
                    console.log([coords, scale])
                })
                .catch((error) => {
                    setNotFound(true);
                    setSearchId("");
                    setShow(false);
                });
        }

    };

    async function fetchSuggestedResults(query) {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/places/api/places/?search=${query}`);
            setSuggestedResults(response.data.filter(result => result.name.toLowerCase().includes(query.toLowerCase())));
        } catch (error) {
            console.error("Error fetching suggested results:", error);
        }
    };    

    function handleSuggestedResultClick(result) {
        setSearchId(result.id); // or result.name, depending on your use case
        setSearchQuery(result.name);
        setSuggestedResults([]);
    };       
    
    useEffect(() => {
        if (searchQuery.trim() !== "") {
            fetchSuggestedResults(searchQuery);
        } else {
            setSuggestedResults([]);
        }
    }, [searchQuery]);    

    useEffect(() => {
        if (map) {
            map.setCenter(coords);
            map.setZoom(scale);
        }
    }, [map, coords, scale]);

    useEffect(() => {
        async function fetchAndSetMarkers() {
            const response = await getPlaces();
            if (response.data.length > 0) {
                const markers = await Promise.all(
                    response.data.map(async (place) => {
                        try {
                            const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${place.address.replace(
                                /[-#,]/g,
                                " "
                            )}.json?access_token=${mapboxgl.accessToken}`;
                            const response = await fetch(endpoint);
                            const result = await response.json();
                            const coordinates = result?.features[0]?.geometry?.coordinates || [];
                            return { coordinates, place };
                        } catch (error) {
                            console.log(error);
                            return null;
                        }
                    })
                );
                setMapMarkers(markers.filter(marker => marker !== null));
            }
        }
        fetchAndSetMarkers();
    }, []);

    useEffect(() => {
        if (map && mapMarkers.length > 0) {
            map.on("load", () => {
                mapMarkers.forEach(markerInfo => {
                    new mapboxgl.Marker()
                        .setLngLat(markerInfo.coordinates)
                        .addTo(map);
                });
            });
        }
    }, [map, mapMarkers]);    

    return (
        <div>
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="Search a place by ID or name"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                    }}
                />
                <Button
                    variant="warning"
                    id="button-addon1"
                    onClick={searchHandler}
                >
                    Search
                </Button>
            </InputGroup>
            <ul className="suggested-results">
                {suggestedResults.map(result => (
                    <li
                        key={result.id}
                        onClick={() => handleSuggestedResultClick(result)}
                    >
                        {result.name}
                    </li>
                ))}
            </ul>
            <div
                className="map-container"
                ref={mapContainerRef}
                style={{
                    width: "calc(100vw - 300px)",
                    height: "calc(100vh - 200px)",
                    marginTop: 10,
                }}
            ></div>
            <button onClick={() => {navigate('/places')}}>Manage Places</button>
        </div>
    );
}