import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaList, FaShoppingCart, FaChartBar, FaPhone, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import { LoginContext } from "../context/login";
import { useContext } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { loged, setLoged } = useContext(LoginContext)

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Menu", icon: <FaList />, path: "/menu" },
    { name: "Add Product", icon: <FaPlus />, path: "/ProductAdd" }, // 🔹 Added here
    { name: "Orders", icon: <FaShoppingCart />, path: "/orders" },
    { name: "Chart List", icon: <FaChartBar />, path: "/charts" },
    { name: "Contact Us", icon: <FaPhone />, path: "/contact" },
  ];
  
  const handleLogout = () => {
    if (confirm('Do you want to log out')) {
      localStorage.removeItem("token");
      setLoged(false);
      navigate("/login");
    }
  };

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="h-screen w-[20%] bg-[#4b2e2e] text-[#f5f0e6] flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold text-center border-b border-[#6f4e37]">
        CoffeeSync
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (item.name == 'Dashboard' || item.name == 'Add Product') && JSON.parse(localStorage.getItem("user"))?.role == 'Manager' ? ((
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition 
              ${isActive
                  ? "bg-[#6f4e37] text-white"
                  : "hover:bg-[#7b4d35] hover:text-white"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          )) : ((item.name != 'Dashboard' && item.name != 'Add Product') && <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition 
              ${isActive
                ? "bg-[#6f4e37] text-white"
                : "hover:bg-[#7b4d35] hover:text-white"
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </button>)
        })}
      </nav>

      {
        loged ? (

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-[#7b4d35] hover:text-white m-4 mt-0 transition"
          >
            <span className="text-lg"><FaSignOutAlt /></span>
            <span>Logout</span>
          </button>
        ) : (<button
          onClick={handleLogin}
          className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-[#7b4d35] hover:text-white m-4 mt-0 transition"
        >
          <span className="text-lg"><IoLogIn /></span>
          <span>Login</span>
        </button>)
      }

      <div className="p-4 border-t border-[#6f4e37] text-sm text-[#d1c4b2] text-center">
        © 2025 CoffeeSync
      </div>
    </div>
  );
};

export default Sidebar;
