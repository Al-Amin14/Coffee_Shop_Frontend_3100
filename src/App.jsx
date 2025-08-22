import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Register from './components/registration'
import Login from './components/login'
import MenuPage from './pages/Menu'
import Dashboard from './pages/DashBord'
import ContactUs from './pages/ContactUs'

const App = () => {
  const navigate=useNavigate()
  
  return (
    <div className='flex'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/menu' element={<MenuPage />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>

    </div>
  )
}

export default App
