import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import UpgradeIcon from '@mui/icons-material/Upgrade';


const EventDetails = () => {

    const { id } = useParams();
    // console.log(id);
    const [eve, setEvent] = useState({});
    const [people, setPeople] = useState([]);

    const [isDel, setIsDeleted] = useState(false);

    const navigate = useNavigate();

    const getEvent = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/event/getParticularEvent/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const { success, participants, event } = response.data;

            if (success) {
                setEvent(event)
                setPeople(participants);

                console.log("Is deleted", event.isDeleted);
                setIsDeleted(event.isDeleted);
            }

        }

        catch (err) {
            console.log(err);
        }
    }

    //delete button
    const deleteEvent = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            const response = await axios.post('http://localhost:3000/event/deleteEvent', { eventID: id }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const { success, messsage } = response.data;

            if (success) {
                toast.success('Event Deleted');
                setTimeout(() => {
                    navigate('/home');

                }, 1800)

            }
            console.log(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        getEvent();
    }, [])


    return (
        <div className="w-full flex flex-col lg:flex-row justify-center items-center p-6 mt-10 gap-10 flex-wrap">
            {/* Event Details Section */}
            <div className="w-full lg:w-2/3 border-2 border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg">
                {isDel && (
                    <p className="text-white bg-red-600 w-20 mb-5 text-sm font-medium py-1 px-3 rounded-lg">
                        Deleted
                    </p>
                )}
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-2xl font-bold text-slate-600 break-words max-w-full">
                        {eve.eventName}
                    </h1>

                </div>
                <p className="mt-4  text-gray-600 break-words">
                    <span className="font-semibold text-slate-700 text-lg">Description: </span>
                    {eve.description}
                </p>
                <p className="mt-2 text-gray-600">
                    <span className="font-semibold text-slate-700 text-lg">Date: </span>
                    {eve.eventTime && eve.eventTime.split('T')[0]}
                </p>

                <div className="mt-6 border-2 border-gray-300 rounded-lg p-4">
                    <h1 className="text-lg font-semibold text-gray-700 mb-4">Invitees</h1>
                    <div className="flex flex-wrap gap-2">
                        {people.map((item, index) => (
                            <p
                                key={index}
                                className="bg-blue-500 text-white px-3 py-2 my-2 text-sm rounded break-words max-w-full"
                            >
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center ">
                {!isDel && (<div>
                    <button
                        onClick={deleteEvent}
                        className="border-2 border-red-600 text-red-600 hover:text-white hover:bg-red-600 px-6 py-2 font-medium rounded-lg flex flex-row  transition duration-300"
                    >
                        <DeleteIcon className='mx-1'/>Delete Event
                    </button>

                    <button className=' border-2 border-blue-600 text-blue-700 hover:bg-blue-600  hover:text-white p-2 w-full mt-5 rounded-lg font-poppins transition duration-300' onClick={() => navigate(`/updateEvent/${id}`)} ><UpgradeIcon fontSize='medium'/>Update Event</button>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    )
}

export default EventDetails
