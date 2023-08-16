import axios from "axios";

const placesApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/places/api/places/',
});

export const searchName = (query) => axios.get(`/?search=${query}`);
export const getPlaces = () => placesApi.get('/');
export const getPlaceById = (id) => placesApi.get(`/${id}`)
export const addPlace = (place) => placesApi.post('/', place);
export const deletePlace = (id) => placesApi.delete(`/${id}`)
export const updatePlace = (id, place) => placesApi.put(`/${id}/`, place)