import React, {  useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContextProvider } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';


const Register = () => {

    const navigate = useNavigate();

    const {login} = useContext(AuthContextProvider);

    const [formData, setFormData] = useState({
        name : '',
        email : '',
        password : ''
    })

    const handleChange = (e) =>{

        const {name, value } = e.target;

       setFormData((prev) =>({
            ...prev,
            [name] : value
       }))

    }

    const handleForm = async (e) =>{
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:3000/user/register',formData);
            console.log(response.data);

            const {token, success, message, name} = response.data;

            if(success){
              login(token, name);
              toast.success(message);
              setTimeout(()=>{
                  navigate('/home');
              }, 1500)
            }
            else{
              toast.error(message);
            }
            

         
        }
        catch(err){
            console.log(err);
        }
    }




  return (
    <div className='h-dvh w-full flex flex-col items-center justify-center gap-10 font-poppins'>
      <h1 className='text-3xl md:text-6xl font-semibold text-stone-500'>Register</h1>
    
        
      <form onSubmit={handleForm} className='sm:w-[300px] sm:h-auto  md:w-[400px] md:h-auto flex flex-col gap-10 border-2 rounded-lg border-stone-300 p-10 hover:shadow-xl'>

        
      <input 
        type="text" 
        name ="name"
        placeholder='Name'
        required
        className='p-3 border-2 border-100-grey outline-stone-400'
        onChange={handleChange}
        />

        <input 
        type="email" 
        name = "email"
        placeholder='Email'
        required
        className='p-3 border-2 border-100-grey outline-stone-400'
        onChange={handleChange}

        />

        <input type='password' 
        name = "password"
        placeholder='Password'
        required
        className='p-3 border-2 border-100-grey outline-stone-500'
        onChange={handleChange}

        />

        <button type="submit" className='border-2 p-2 bg-blue-500 text-white hover:opacity-85  text-lg'>
            Register
        </button>

        <p className='text-md'>Already have an account yet? <Link to="/" className='text-semibold text-blue-500 hover:underline font-semibold'>Login</Link></p>
      </form>
      <ToastContainer />

    </div>
  )
}

export default Register
