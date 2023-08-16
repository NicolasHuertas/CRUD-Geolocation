import React, {useEffect} from 'react'; // Don't forget to import React
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { addPlace, deletePlace, updatePlace, getPlaceById } from '../hooks/places.api';

export function PlaceFormPage() {
    const { register, handleSubmit, setValue } = useForm();
    const placeID = useParams();
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async data => {
        if(placeID.id){
            await updatePlace(placeID.id, data)
        } else{
            await addPlace(data);
        }
        navigate('/places');
    });

    useEffect(()=> {
        async function loadPlace() {
            if(placeID.id){
                const resp = await getPlaceById(placeID.id);
                setValue('name', resp.data.name)
                setValue('description', resp.data.description)
                setValue('address', resp.data.address)
        }};
        loadPlace();
    }, [])

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="name"
                    {...register('name', { required: true })}
                />
                <textarea
                    rows="3"
                    placeholder="description"
                    {...register('description', { required: false })}
                ></textarea>
                <input
                    type="text"
                    placeholder="address"
                    {...register('address', { required: true })}
                />
                <button type="submit">Save Place</button>
            </form>
            {placeID.id && <button onClick={async ()=> 
                {const accept = window.confirm(`delete place ${placeID.id} ?`)
                if (accept){
                    await deletePlace(placeID.id);
                    navigate('/places');
                }
                }}>Delete</button>}
        </div>
    );
}
