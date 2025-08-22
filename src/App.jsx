import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Navbar from './components/Navbar'
import Register from './components/registration'
import Login from './components/login'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
       
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
       
      </Routes>
    </div>
  )
}

export default App
