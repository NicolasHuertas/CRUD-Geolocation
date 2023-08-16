import React, { useEffect, useState } from "react";
import { getPlaces } from "../hooks/places.api";
import { useNavigate} from "react-router-dom";

export function PlaceList() {

    const [places, setPlaces] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
            async function loadPlaces(){
                const res = await getPlaces();
                setPlaces(res.data)
            };
            loadPlaces();
    }, []);

    return(
        <div>
            {places.map(place => (
                <div onClick={
                    () => {
                        navigate(`/places/${place.id}`)
                    }
                } key={place.id}>
                    <h1>{place.name}</h1>
                    <p>{place.address}</p>
                    <p>{place.description}</p>
                </div>
            ))}
        </div>
    )
}