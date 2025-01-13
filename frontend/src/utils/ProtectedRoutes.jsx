import React, { useContext } from 'react'
import AuthContext, { AuthContextProvider } from '../context/AuthContext'
import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoutes = () => {

    const { authentication } = useContext(AuthContextProvider);

    return (authentication 
        
        ? ( <Outlet />) 
         
        : <Navigate to='/' />)
}

export default ProtectedRoutes
