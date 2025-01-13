import React, { useState } from 'react'
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import UpgradeIcon from '@mui/icons-material/Upgrade';


const UpdateEvent = () => {

  const [isOpen, setIsOpen] = useState(true);


  const toggle = () =>{
    setIsOpen((prev) => !prev);
  }

  return (
    <div className='w-ful h-dvh flex flex-row justify-around items-center'>

      {/*form for updating event */}


      <form className='rounded-lg font-poppins border-2 border-slate-300 hover:shadow-md hover:shadow-blue-300 w-[500px] h-auto flex flex-col items-start gap-5 p-5 py-10'>


        <h1 className='text-2xl font-merriweather font-semibold text-center text-slate-600 mb-10 w-full'>Update Event</h1>

        <div className='w-full flex flex-col items-start justify-around gap-2 '>
          <label className=' text-slate-600'>Event Name : </label>
          <input type="text" className='p-2 border-2 border-slate-400 w-full' />
        </div>

        <div className='w-full flex flex-col items-start justify-around gap-2 '>
          <label className='text-slate-600'>Description : </label>
          <textarea className='p-2 border-2 w-full border-slate-400' rows={6} cols={50} />
        </div>


        <div className='w-full flex flex-col gap-1'>
          <label className='text-sm font-merriweather text-slate-700'>Event Date :  </label>
          <input required type="date" name="eventTime" className='p-2 border-2  border-gray-300 outline-slate-500' placeholder='YYYY-MM-DD' />
        </div>


        <div className='text-md flex flex-row w-full items-center justify-center gap-5 bg-slate-50 p-2 rounded-lg'>
          <p className='text-md text-slate-700 font-poppins'>Invite people to this event</p>
          <button onClick={toggle} className=' flex flex-row items-center justify-center w-1/3 font-merriweather text-white-600 border-slate-600 hover:bg-slate-700 hover:text-white  border-2 p-1 hover:shadow-xl'><EmailIcon className='mx-2' />Invite</button>



          <Drawer onClose={isOpen} direction='right' size={500} className='overflow-auto' >
            <div className='w-full h-auto flex flex-col items-center py-5'>
              <h1 className='text-2xl rounded-md font-poppins text-white bg-blue-600 p-2'>Invite People</h1>
              <hr className='border-1 w-full bg-black my-5' />

              {/*input to add external participants */}
              <p className='w-full block text-slate-600 font-bold text-start px-10'>Write email of participants you want to invite</p>

              <div className="w-full h-[50px] flex flex-row items-center justify-between mt-5 px-5 gap-3">
                <input
                  

                  className="h-full border-2 max-h-full border-slate-400 w-[80%] p-3 outline-slate-600"
                  placeholder="E-mail"
                />
                <button
                  type="button" // Prevents form submission

                  className="h-full w-1/5 bg-blue-600 text-white hover:opacity-90"
                >
                  Add
                </button>
              </div>


              <h1 className='text-gray-200 font-bold mt-5 text-xl bg-blue-600 p-2 rounded-xl'>OR</h1>

              {/*Showing friends and colleagues */}
              <div className='w-full h-full flex flex-col gap-5 items-start px-5 py-6'>
                <p className='w-full text-start text-slate-700 font-bold '>Invite your Friends or Colleagues by clicking checkbox</p>



              </div>

              {/* <button  className='w-1/3 p-2 bg-blue-600 text-white hover:opacity-85'>Add</button> */}
            </div>
          </Drawer>

          <button className=' items-center justify-center flex flex-row gap-2 w-1/2 bg-blue-600 text-white p-2 font-merriweather hover:opacity-85 text-lg'>Update <UpgradeIcon fontSize='large' /></button>

        </div>


      </form>



    </div>
  )
}

export default UpdateEvent
