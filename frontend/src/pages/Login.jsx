import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContextProvider } from '../context/AuthContext.jsx';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {

    const navigate = useNavigate();
    const { login } = useContext(AuthContextProvider);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }


    const handleForm = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post("http://localhost:3000/user/login",formData);
            

            const { success, message, token, name} = response.data;
            // console.log(response.data);
            if (success) {
                login(token, name);
                navigate('/home');
            }
            else {
                toast.error(message);
            }


        }
        catch (err) {
            toast.error(err);
        }
    }


    return (
        <div className='h-dvh w-full flex flex-col items-center justify-center gap-10 font-poppins'>
            <h1 className='text-6xl font-semibold text-slate-500'>Login</h1>


            <form onSubmit={handleForm} className='sm:w-[300px] sm:h-[300px]  md:w-[400px] md:h-[400px] flex flex-col gap-10 border-2 rounded-lg border-stone-300 p-10 hover:shadow-xl'>

                <input
                    type="email"
                    name="email"
                    placeholder='Email'
                    required
                    className='p-3 border-2 border-100-grey outline-stone-400'
                    onChange={handleChange}
                />

                <input type='password'
                    name="password"
                    placeholder='Password'
                    required
                    className='p-3 border-2 border-100-grey outline-none'
                    onChange={handleChange}
                />

                <button className='border-2 p-2 bg-blue-500 text-white hover:opacity-85  text-lg'>
                    Login
                </button>

                <p className='text-md'>Don't have an account yet? <Link to="/register" className='font-semibold text-semibold text-blue-500 hover:underline '>Register</Link></p>
            </form>
            
            <ToastContainer />
        </div>
    )
}

export default Login;


