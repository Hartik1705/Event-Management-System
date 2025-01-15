import React, { useEffect, useState } from 'react'
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import ScaleLoader from 'react-spinners/ScaleLoader';

const CreateEvent = () => {


        let currentDate = new Date();

        let min_date = currentDate.getFullYear() + "-" + currentDate.getMonth() + 1 + "-" + currentDate.getDate();
        console.log("min_date",min_date);

    const [loading, setLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    const navigate = useNavigate();

    //participant email
    const [participantEmail, setParticipantEmail] = useState('');


    const [invitedPeople, setInvitedPeople] = useState([]);

    const [formData, setFormData] = useState({
        eventName: '',
        description: '',
        eventTime: ''
    })

    const toggle = () => {
        setIsOpen((prev) => !prev)
    }

    const getUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:3000/user/getUsers', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const { success, users } = response.data;
            // console.log('Create event', response.data);
            if (success) {
                // console.log(users);
                setAllUsers(users);
            }
            else {
                toast.info("Token Expired, Redirecting to Login Page");
                setTimeout(() => {
                    navigate('/');
                }, 4000)

            }

        }

        catch (error) {
            toast.error(error.message);
        }


    }

    // send api to create
    const createEvent = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (invitedPeople.length <= 0) {
                toast.error('Atleast One Participants should be added');
                return;
            }

            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/event/createEvent', {
                //body
                formData, invitedPeople

            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(response.data);
            const { message } = response.data;
            if (message) {

                toast.success("Event created!");
                setTimeout(() => {
                    navigate('/home');
                }, 2000)
            }
            else {
                toast.infp("Token Expired, Redirecting to Login Page");
                setTimeout(() => {
                    navigate('/');
                }, 4000)
            }
        }

        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }

        setFormData('');

    }


    //handling external participants

    const handleExternalParticipants = (email) => {

        if (!email) {
            toast.error('Write a valid email');
        }

        if (invitedPeople.includes(email)) {
            toast.error("Participant is already added");
            return;
        }

        setInvitedPeople((prev) => [...prev, email]);
        setParticipantEmail('');
        toast.success('Added');


    }

    //handling invited people change
    const handleChange = (e) => {
        console.log(e);

        setInvitedPeople((prev) =>
            prev.includes(e)

                ? prev.filter((em) => em !== e)
                : [...prev, e]
        )


    }






    //handling form inputs
    const handleFormInput = (e) => {

        const { value, name } = e.target;

        setFormData({
            ...formData,
            [name]: value
        })
    }


    useEffect(() => {
        getUsers();
    }, [])


    useEffect(() => {
        console.log(allUsers);
    }, [allUsers])


    return (
        <div className='w-full h-dvh flex flex-row items-center justify-evenly my-10'>

            {loading ? 
            
            <div className='w-full h-full flex flex-col items-center justify-center '>
                <ScaleLoader width={5} height={98} color='black' loading={loading} size={400} aria-label='Loading...'/>
                <h1 className='text-lg text-slate-600 font-poppins'>Loading..</h1>
                </div> 
            
            
            : <div className='w-full h-dvh flex flex-row items-center justify-evenly my-10'><div className='min-w-[500px] h-auto mt-10'>
                <form onSubmit={(e) => createEvent(e)} className='w-full h-full flex flex-col items-center justify-center gap-10 border-2 border-gray-300 p-7 rounded-lg hover:shadow-blue-300 hover:shadow-lg'>
                    <h1 className='font-merriweather text-3xl text-gray-600 font-semibold flex flex-row gap-2'><EditCalendarIcon fontSize='large' />Create Event</h1>
                    <div className='w-full flex flex-col gap-1'>
                        <label className='text-sm font-merriweather text-slate-700'>Event Name : </label>
                        <input autoComplete='off' required type="text" value={formData.eventName} name="eventName" onChange={(e) => handleFormInput(e)} className='p-2 border-2 border-gray-300 outline-slate-500' />
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label className='text-sm font-merriweather text-slate-700'> Description : </label>
                        <textarea required type="text" value={formData.description} onChange={(e) => handleFormInput(e)} name="description" className='min-h-[100px] p-2 border-2 border-gray-300 outline-slate-500' />
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label className='text-sm font-merriweather text-slate-700'>Event Date :  </label>
                        <input required type="date" min={min_date} value={formData.eventTime} onChange={(e) => handleFormInput(e)} name="eventTime" className='p-2 border-2  border-gray-300 outline-slate-500' placeholder='YYYY-MM-DD' />
                    </div>

                    <div className='text-md flex flex-row w-full items-center justify-center gap-5 bg-slate-50 p-2 rounded-lg'>
                        <p className='text-md text-slate-700 font-poppins'>Invite people to this event</p>
                        <button onClick={(e) => { e.preventDefault(); toggle() }} className=' flex flex-row items-center justify-center w-1/3 font-merriweather text-white-600 border-slate-600 hover:bg-slate-700 hover:text-white  border-2 p-1 hover:shadow-xl'><EmailIcon className='mx-2' />Invite</button>



                        <Drawer open={isOpen} className='overflow-auto' onClose={toggle} direction="right" lockBackgroundScroll={true} size={500}>
                            <div className='w-full h-auto flex flex-col items-center py-5'>
                                <h1 className='text-2xl rounded-md font-poppins text-white bg-blue-600 p-2'>Invite People</h1>
                                <hr className='border-1 w-full bg-black my-5' />

                                {/*input to add external participants */}
                                <p className='w-full block text-slate-600 font-bold text-start px-10'>Write email of participants you want to invite</p>

                                <div className="w-full h-[50px] flex flex-row items-center justify-between mt-5 px-5 gap-3">
                                    <input
                                        value={participantEmail}
                                        onChange={(e) => setParticipantEmail(e.target.value)}
                                        className="h-full border-2 max-h-full border-slate-400 w-[80%] p-3 outline-slate-600"
                                        placeholder="E-mail"
                                    />
                                    <button
                                        type="button" // Prevents form submission
                                        onClick={() => handleExternalParticipants(participantEmail)}
                                        className="h-full w-1/5 bg-blue-600 text-white hover:opacity-90"
                                    >
                                        Add
                                    </button>
                                </div>


                                <h1 className='text-gray-200 font-bold mt-5 text-xl bg-blue-600 p-2 rounded-xl'>OR</h1>

                                {/*Showing friends and colleagues */}
                                <div className='w-full h-full flex flex-col gap-5 items-start px-5 py-6'>
                                    <p className='w-full text-start text-slate-700 font-bold '>Invite your Friends or Colleagues by clicking checkbox</p>
                                    {allUsers.map((user) => (
                                        <div className='w-full h-auto flex flex-row items-center justify-between bg-slate-200 p-3 px-4'>
                                            <h1 className='text-lg text-gray-600 font-poppins text-md'>{user.name}</h1>
                                            <input type="checkbox" className='size-6' onChange={() => handleChange(user.email)} checked={invitedPeople.includes(user.email)} />
                                        </div>
                                    ))}
                                </div>

                                {/* <button  className='w-1/3 p-2 bg-blue-600 text-white hover:opacity-85'>Add</button> */}
                            </div>
                        </Drawer>
                    </div>

                    <button className='items-center justify-center flex flex-row gap-2 w-1/2 bg-blue-600 text-white p-2 font-merriweather hover:opacity-85 text-lg'>Create <AddCircleOutlineIcon fontSize='medium' /></button>

                </form>


            </div>

            {/*Displaying Participants*/}

            <div className='w-1/3 h-auto flex flex-col items-center border-2 border-slate-300 rounded-lg p-4'>
                <h1 className='text-slate-700 text-lg font-poppins '>People Whom you invited</h1>

                <div className='w-full h-full flex  items-start flex-row flex-wrap justify-between my-6'>

                    {invitedPeople.map((item) => (
                        <p className='p-2 bg-blue-600 text-white px-2 m-2'>{item}</p>
                    ))}

                </div>
            </div>



            <ToastContainer /></div> }

            {/*Event Creation Form */}
            
        </div>
    )
}

export default CreateEvent;
