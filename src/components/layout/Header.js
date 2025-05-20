import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/Authentication';

const Header = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout: logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser(); 
      navigate('/login'); 
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleDropdown = () => {
  setShowDropdown(!showDropdown);
  };

  return (
    <header className="bg-white shadow h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button className="md:hidden mr-4 text-gray-600">
          <FaBars className="h-6 w-6" />
        </button>
        <span className="text-xl font-semibold text-gray-800">Quản Lý Kho Hàng</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
            <FaBell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
        
        <div className="relative">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={toggleDropdown}
          >
            <FaUserCircle className="h-8 w-8 text-gray-600" />
            <span className="text-gray-700">Admin</span>
          </div>
          
          {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button 
              onClick={handleLogout}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaSignOutAlt className="mr-2" /> Đăng xuất
            </button>
          </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;