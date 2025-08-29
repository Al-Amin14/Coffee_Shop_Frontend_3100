import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { LoginContext } from './context/login'
import Navbar from './components/Navbar'
import Register from './components/registration'
import Login from './components/login'
import MenuPage from './pages/Menu'
import Dashboard from './pages/DashBord'
import ContactUs from './pages/ContactUs'
import ProductForm from './pages/addproducts'
import ChatList from './pages/charts'
import { Toaster } from "react-hot-toast";
import Orders from './pages/orders'

const App = () => {

  const navigate = useNavigate()
  const [loged, setLoged] = useState(false);

  return (
    <div className='flex'>
      <LoginContext.Provider value={{ loged, setLoged }}>
        <Navbar />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/menu' element={<MenuPage />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/charts' element={<ChatList />} />
          <Route path='/Orders' element={<Orders />} />
          <Route path='/productAdd' element={<ProductForm />} />
        </Routes>
        <Toaster position="top-center" />
      </LoginContext.Provider>
    </div>
  )
}

export default App