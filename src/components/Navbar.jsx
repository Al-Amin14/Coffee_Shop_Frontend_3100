import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaList, FaShoppingCart, FaChartBar, FaPhone, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/" },
    { name: "Menu", icon: <FaList />, path: "/menu" },
    { name: "Orders", icon: <FaShoppingCart />, path: "/orders" },
    { name: "Chart List", icon: <FaChartBar />, path: "/charts" },
    { name: "Contact Us", icon: <FaPhone />, path: "/contact" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen w-[20%] bg-[#4b2e2e] text-[#f5f0e6] flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold text-center border-b border-[#6f4e37]">
        CoffeeSync
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
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
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-[#7b4d35] hover:text-white m-4 mt-0 transition"
      >
        <span className="text-lg"><FaSignOutAlt /></span>
        <span>Logout</span>
      </button>

      <div className="p-4 border-t border-[#6f4e37] text-sm text-[#d1c4b2] text-center">
        © 2025 CoffeeSync
      </div>
    </div>
  );
};

export default Sidebar;
