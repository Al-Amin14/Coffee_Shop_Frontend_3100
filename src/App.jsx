import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Navbar from './components/Navbar'
import Register from './components/registration'
import Login from './components/login'
import MenuPage from './pages/Menu'
import Dashboard from './pages/DashBord'
import ContactUs from './pages/ContactUs'

const App = () => {
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
