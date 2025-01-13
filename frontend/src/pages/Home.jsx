import React, { useEffect, useState } from 'react'
import Navbar from '../component/Navbar.jsx';
import axios from 'axios';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import EventCard from '../component/EventCard.jsx';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Home = () => {

    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    // console.log("Home page", token)
    const getEvents = async () => {

        try {
            const response = await axios.get("http://localhost:3000/event/getEvents", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            console.log("This is home page", response.data);
            const {success, events} = response.data;
            if(success){
                setEvents(events);
            }
            else{
                const {message} = response.data
                if(message == "jwt expired"){

                    toast.info('Token expired, Redirecting to login page')

                    setTimeout(() =>{
                        navigate('/');
                    },4000)
                    logout();
                }
            }

        }
        catch (error) {
            console.log(error);
        }


    }

    useEffect(() => {
        getEvents();
    }, [])

    useEffect(() => {
        console.log(events);

    }, [events]);


    return (
        <div>
            <div className='font-poppins p-5 flex flex-col w-full h-auto justify-evenly items-center gap-5 mt-2'>
                <h1 className='text-slate-600 font-poppins text-md md:text-xl'>Want to create an Event? We got you Covered! </h1>

                <button onClick={() =>navigate('/createEvent')} className='font-poppins bg-blue-600 p-3 text-gray-100 text-lg hover:shadow-xl flex flex-row items-center'><EventNoteRoundedIcon className='mx-2' />Create Event</button>
            </div>
            <hr />




            {/* Section to show upcoming events */}
      
            <div className='w-full h-auto flex flex-col items-center mt-8'>
                <h1 className='md:text-5xl text-slate-600 p-2 md:m-4 font-poppins'>Upcoming Events</h1>
            </div>

            {/*events */}
            {events.length > 0 ? (   <div className='w-full h-auto flex flex-row items-center flex-wrap p-10'>
                {events.map((e) => (
    
                    <EventCard

                        key={e._id}
                        to={e._id}
                        eventName={e.eventName}
                        createdBy={e.createdBy.name}
                        createdAt = {e.createdAt.split('T')[0]}
                        eventTime={e.eventTime.split('T')[0]}
                    />

                ))}
            </div>) : (<h1 className='md:text-2xl text-gray-400 text-center mt5'>No Events For Now &#128516;</h1>) }
         

            <ToastContainer />
        </div>

            

    )
}

export default Home
