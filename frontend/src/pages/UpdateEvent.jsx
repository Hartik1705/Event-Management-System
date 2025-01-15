import React, { useEffect, useState } from 'react';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import EmailIcon from '@mui/icons-material/Email';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const UpdateEvent = () => {


  const [isOpen, setIsOpen] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();
  //new Data
  const [allUsers, setAllUsers] = useState([]);
  const [newParticipants, setNewParticipants] = useState([]);


  //external participants

  const [extParticipant, setExtParticipants] = useState([]);




  //previousData
  const [previousParticipants, setPreviousParticipants] = useState([]);
  const [previousData, setPreviousData] = useState({
    eventName: '',
    description: '',
    eventTime: '',
  });


  //get all users

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
            setTimeout(()=>{
                navigate('/');
            },4000)
            
        }

    }

    catch (error) {
        toast.error(error.message);
    }


}


//updating event and participants

const updateEvent = async(e) =>{

  e.preventDefault();
  try{
    const token  = localStorage.getItem('token');
    const response = await axios.post(`http://localhost:3000/event/updateEvent`, {
    eventID : id, invitedParticipants: previousParticipants, 
    eventName : previousData.eventName,
    description : previousData.description,
    eventTime : previousData.eventTime}, {
      headers : {
        Authorization : `Bearer ${token}`
      }
    })

    console.log(response.data);
    const {success} = response.data;

    if(success){
        toast.success('Event Updated!');
        setTimeout(()=>{
          navigate('/home');
        }, 2000)
    }
    else{
      console.log()
    }

  }
  catch(error){
      toast.err(error);
  }

}



  //handling invitees through checkbox

  const handleChange = (email) =>{
    console.log(email);
    setPreviousParticipants((prev) => prev.includes(email) ? 
    prev.filter((e) => e !== email)  : 
    [...prev,email]
  )

  }


  const handleExternalParticipants = (email) =>{
    console.log(email);

    if(previousParticipants.includes(email)){
      toast.error("Participant is already added");
      return;
    }
    
    setPreviousParticipants((prev) => [...prev, email]);
    setExtParticipants('');
  }





  // Fetch event data
  const getEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3000/event/getParticularEvent/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { success, participants, event } = response.data;

      if (success) {

        console.log(participants)
        setPreviousParticipants(participants);


        setPreviousData({
          eventName: event.eventName || '',
          description: event.description || '',
          eventTime: event.eventTime.split('T')[0] || '',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getEvent();
    getUsers();
  }, []);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full h-dvh flex flex-row justify-around items-center my-10">
      <form onSubmit={(e) =>updateEvent(e)} className="rounded-lg font-poppins border-2 border-slate-300 hover:shadow-md hover:shadow-blue-300 w-[500px] h-auto flex flex-col items-start gap-5 p-5 my-10">
        <h1 className="text-2xl font-merriweather font-semibold text-center text-slate-600 mb-10 w-full">
          Update Event
        </h1>

        {/* Event Name */}
        <div className="w-full flex flex-col items-start justify-around gap-2">
          <label className="text-slate-600">Event Name:</label>
          <input
            value={previousData.eventName}
            onChange={(e) => setPreviousData({ ...previousData, eventName: e.target.value })}
            type="text"
            className="p-2 border-2 border-slate-400 w-full"
          />
        </div>

        {/* Description */}
        <div className="w-full flex flex-col items-start justify-around gap-2">
          <label className="text-slate-600">Description:</label>
          <textarea
            value={previousData.description}
            onChange={(e) =>
              setPreviousData({ ...previousData, description: e.target.value })
            }
            className="p-2 border-2 w-full border-slate-400"
            rows={6}
          />
        </div>

        {/* Event Date */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-sm font-merriweather text-slate-700">
            Event Date:
          </label>
          <input
            type="date"
            value={previousData.eventTime}
            onChange={(e) =>
              setPreviousData({ ...previousData, eventTime: e.target.value })
            }
            className="p-2 border-2 border-gray-300 outline-slate-500"
            required
          />
        </div>

        {/* Invite People */}
        <div className="text-md flex flex-row w-full items-center justify-center gap-5 bg-slate-50 p-2 rounded-lg">
          <p className="text-md text-slate-700 font-poppins">
            Invite people to this event
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggle();
            }}
            className="flex flex-row items-center justify-center w-1/3 font-merriweather border-slate-500 hover:bg-slate-700 hover:text-white border-2 p-1 hover:shadow-xl"
          >
            <EmailIcon className="mx-2" />
            Invite
          </button>

          {/* Drawer for Invites */}
          <Drawer
            open={isOpen}
            onClose={toggle}
            direction="right"
            size={500}
            className="overflow-auto"
          >
            <div className="w-full h-auto flex flex-col items-center py-5">
              <h1 className="text-2xl rounded-md font-poppins text-white bg-blue-600 p-2">
                Invite People
              </h1>
              <hr className="border-1 w-full bg-black my-5" />
              <p className="w-full block text-slate-600 font-bold text-start px-10">
                Write email of participants you want to invite
              </p>
              <div className="w-full h-[50px] flex flex-row items-center justify-between mt-5 px-5 gap-3">
                <input
                onChange={(e) => setExtParticipants(e.target.value)}
                  className="h-full border-2 max-h-full border-slate-400 w-[80%] p-3 outline-slate-600"
                  placeholder="E-mail"
                />
                <button
                  type="button"
                  onClick={() =>handleExternalParticipants(extParticipant)}
                  className="h-full w-1/5 bg-blue-600 text-white hover:opacity-90"
                >
                  Add
                </button>
              </div>
              <h1 className="text-gray-200 font-bold mt-5 text-xl bg-blue-600 p-2 rounded-xl">
                OR
              </h1>
            </div>

            <div className='w-full h-full flex flex-col gap-5 items-start px-5 py-6'>
              <p className='w-full text-start text-slate-700 font-bold '>Invite your Friends or Colleagues by clicking checkbox</p>
              {allUsers.map((user) => (
                <div className='w-full h-auto flex flex-row items-center justify-between bg-slate-200 p-3 px-4'>
                  <h1 className='text-lg text-gray-600 font-poppins text-md'>{user.name}</h1>
                  <input type="checkbox" className='size-6' onChange={() => handleChange(user.email)}  checked={previousParticipants.includes(user.email)} />
                </div>
              ))}
            </div>


          </Drawer>
        </div>

        {/* Update Button */}
        <div className="w-full flex items-center justify-center mt-5">
          <button className="items-center justify-center flex flex-row gap-2 w-1/2 bg-blue-600 text-white p-2 font-merriweather hover:opacity-85 text-lg">
            Update <UpgradeIcon fontSize="large" />
          </button>
        </div>
      </form>

      {/*Displaying Participants*/}

      <div className='w-1/3 h-auto flex flex-col items-center border-2 border-slate-300 rounded-lg p-4'>
        <h1 className='text-slate-700 text-lg font-poppins '>People Whom you invited</h1>

        <div className='w-full h-full flex  items-start flex-row flex-wrap justify-between my-6'>

          {previousParticipants.map((item) => (
            <p className='p-2 bg-blue-600 text-white px-2 m-2'>{item}</p>
          ))}

        </div>
      </div>

          <ToastContainer />
    </div>
  );
};

export default UpdateEvent;
