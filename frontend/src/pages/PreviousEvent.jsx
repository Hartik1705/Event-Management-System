import React, { useEffect, useState } from 'react'
import axios from 'axios';
import EventCard from '../component/EventCard';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const PreviousEvents = () => {

  const navigate = useNavigate();
  const [delEvent, setDelEvent] = useState([]);

  const getDelEvents = async () => {

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/event/getPreviousEvents', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log(response.data);
  
      const {success } = response.data;

      if(success){
        setDelEvent(response.data.events);

      }
      else{
        if(response.data.message === "jwt expired"){
          toast.info("Token Expired, Redirecting to Login Page");
          setTimeout(() =>{
            navigate('/');
          },4000)
        }
      }

    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getDelEvents();
  }, [])

  useEffect(() =>{

  }, [delEvent])



  return (
    <div className='w-full h-full flex flex-col  items-center justify-center my-10'>

      <h1 className='text-5xl text-slate-600 my-5 font-bold'>Previous Events</h1>

      {delEvent.length > 0 ? (<div className='w-full h-auto flex flex-row flex-wrap  items-center justify-between font-merriweather p-10'>


        {delEvent.map((eve) => (
          <EventCard
            key={eve._id}
            to={eve._id}
            eventName={eve.eventName}
            eventTime={eve.eventTime}
            createdAt={eve.createdAt}
          />
        ))}
      </div>) : (<div className='w-full h-auto  flex flex-col justify-center items-center'>
        <p className='text-2xl my-10 text-slate-400 font-poppins'>No Events yet &#128533;</p>
         </div>)}
        <ToastContainer />
    </div>

  )
}

export default PreviousEvents;
