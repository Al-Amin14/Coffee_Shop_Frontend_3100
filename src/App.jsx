import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';  
import { LoginContext } from './context/login';
import Navbar from './components/Navbar';
import Register from './components/registration';
import Login from './components/login';
import MenuPage from './pages/Menu';
import Dashboard from './pages/DashBord';
import ContactUs from './pages/ContactUs';
import ProductForm from './pages/addproducts';
import ChatList from './pages/charts';
import Orders from './components/Orders';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [loged, setLoged] = useState(null); 
  const location = useLocation(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoged(!!token); 
  }, []);

  if (loged === null) {
    return <div className="w-full text-center mt-10 text-lg">Loading...</div>;
  }

  const noNavbarRoutes = ['/login', '/register'];

  return (
    <div className="flex">
      <LoginContext.Provider value={{ loged, setLoged }}>
        {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
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
  );
};

export default App;
