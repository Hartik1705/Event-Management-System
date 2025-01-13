import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContextProvider } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {

  const { logout } = useContext(AuthContextProvider);
  const navigate = useNavigate();

  const location = useLocation();



  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <div>
      {token && (<div className='h-[120px] w-full'>
        <nav className='w-full h-[120px] bg-blue-600 flex flex-row items-center justify-between px-10 font-poppins'>
          <Link to='/home' className='text-2xl md:text-5xl text-stone-100 font-semibold font-merriweather'>EMS</Link>



          <ul className='flex flex-row justify-between w-1/3 h-full items-center'>
            <Link className='text-white text-xl hover:underline' to='/home'>Home</Link>
            <Link to='/previousEvents' className='text-white text-xl hover:underline'>Events</Link>
            <div className='flex flex-col items-center justify-around text-white'>
              <AccountCircleIcon fontSize='large' />
              <p className='text-md mt-1 font-semibold'>{name}</p>
            </div>
            <button className="text-xl text-black p-2  bg-white  hover:bg-red-500 hover:text-white rounded-lg text-center justify-center" onClick={handleLogout}>Logout</button>
          </ul>

        </nav>
        <ToastContainer />
      </div>)}

    </div>
  )
}

export default Navbar

