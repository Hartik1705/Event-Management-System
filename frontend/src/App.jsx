import { useContext, useState } from 'react'
import Login from './pages/Login.jsx'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import EventDetails from './component/EventDetails.jsx'
import Navbar from './component/Navbar.jsx'
import CreateEvent from './pages/CreateEvent.jsx'
import PreviousEvents from './pages/PreviousEvent.jsx'
import ProtectedRoutes from './utils/ProtectedRoutes.jsx'
import UpdateEvent from './pages/UpdateEvent.jsx'


function App() {

  const location = useLocation();

  const paths = ['/', '/register'];

  return (
    <div>
      
    {!paths.includes(location.pathname) && <Navbar />}

      <Routes>

        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />


      //Protected Routes
        <Route element={<ProtectedRoutes />}>
          <Route path='/home' element={<Home />} />
          <Route path='/events/:id' element={<EventDetails />} />
          <Route path='/createEvent' element={<CreateEvent />} />
          <Route path='/previousEvents' element={<PreviousEvents />} />
          <Route path='/updateEvent/:id' element={<UpdateEvent />}  />
        </Route>



      </Routes>
    </div>

  )
}

export default App
