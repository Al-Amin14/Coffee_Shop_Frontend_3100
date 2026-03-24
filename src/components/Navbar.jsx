import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome, FaList, FaShoppingCart, FaPhone, FaSignOutAlt, FaPlus
} from "react-icons/fa";
import { RiListOrdered2 } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { IoLogIn } from "react-icons/io5";
import { LoginContext } from "../context/login";
import AuthUser from "../components/AuthUser";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loged, setLoged } = useContext(LoginContext);
  const { logout, http } = AuthUser();

  const [customerCount, setCustomerCount] = useState(0); // ✅ NEW

  // ✅ Fetch users and count customers
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await http.get("/users"); // uses baseURL

        if (res.data.success) {
          const users = res.data.users;

          const customers = users.filter(
            (user) => user.role === "Customer"
          );

          setCustomerCount(customers.length);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Menu", icon: <FaList />, path: "/menu" },
    { name: "Add Product", icon: <FaPlus />, path: "/productAdd" },
    { name: "Orders", icon: <FaShoppingCart />, path: "/orders" },
    { name: "Cart List", icon: <RiListOrdered2 />, path: "/carts" },
    { name: "Contact Us", icon: <FaPhone />, path: "/contact" },
    { name: "Profile", icon: <CgProfile />, path: "/profile" },
  ];

  const handleLogout = () => {
    if (window.confirm("Do you want to log out?")) {
      logout();
      setLoged(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen w-[20%] bg-[#4b2e2e] text-[#f5f0e6] flex flex-col shadow-lg">
      <div className="flex item-center p-4">
        <div>Total user : </div>
        <div className="pl-2 text-center text-lg font-semibold">
           {customerCount}
        </div>
      </div>
      <div className="justify-center items-center">

        <div className="p-6 text-2xl font-bold text-center border-b border-[#6f4e37]">
          CoffeeSync
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (item.name == 'Dashboard' || item.name == 'Add Product') && JSON.parse(localStorage.getItem("user"))?.role == 'Manager' ? ((
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition 
                ${isActive ? "bg-[#6f4e37] text-white" : "hover:bg-[#7b4d35] hover:text-white"}`}
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

      {loged ? (
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-[#7b4d35] hover:text-white m-4 mt-0 transition"
        >
          <span className="text-lg"><FaSignOutAlt /></span>
          <span>Log Out</span>
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-[#7b4d35] hover:text-white m-4 mt-0 transition"
        >
          <span className="text-lg"><IoLogIn /></span>
          <span>Log In</span>
        </button>
      )}

      <div className="p-4 border-t border-[#6f4e37] text-sm text-[#d1c4b2] text-center">
        © 2025 CoffeeSync
      </div>
    </div>
  );
};

export default Sidebar;