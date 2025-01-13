import React from 'react'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { Link } from 'react-router-dom';

const EventCard = (props) => {


  return (
    <div className='font-poppins w-[400px] h-[400px]  flex flex-col hover:shadow-lg p-5 m-5 border-2 border-gray-100 justify-center gap-10 rounded-xl'>
        

        <h1 className='md:text-xl font-semibold text-gray-700'><span className='text-blue-600 underline'>Event</span> : {props.eventName.length > 20 ? props.eventName.slice(0,20).concat('...') : props.eventName}</h1>


        <p className='flex flex-row items-center text-gray-500'> <span className='font-semibold text-gray-600'>Event Date</span> : {props.eventTime.split('T')[0]}</p>

        <p className='text-gray-500'><span className='font-semibold text-gray-600'>Created At : </span>{props.createdAt.split('T')[0]}</p>

        <Link to = {`/events/${props.to}`} className='bg-blue-600 p-2 text-white hover:opacity-90 text-xl flex items-center justify-center'>Details <ArrowForwardIosRoundedIcon className='mx-1'/></Link>

    </div>
  )
}

export default EventCard
