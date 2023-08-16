import React from "react";
import { PlaceList } from "../components/PlaceList";
import { useNavigate } from "react-router-dom";

export function PlaceListPage() {

    const navigate = useNavigate();

    return(
        <div>
            <h1>Places</h1>
            <button onClick={() => {navigate('/')}}>Map</button>
            <button onClick={() => {navigate('/places-add')}}>Add Place</button>
            <PlaceList/>
        </div>
    )
}