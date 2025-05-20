// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { FaWarehouse, FaBoxes, FaListAlt, FaShoppingCart, FaChartLine } from 'react-icons/fa';

// const Sidebar = () => {
//   const menuItems = [
//     { path: '/', name: 'Dashboard', icon: <FaChartLine /> },
//     { path: '/inventory', name: 'Inventory', icon: <FaWarehouse /> },
//     { path: '/products', name: 'Products', icon: <FaBoxes /> },
//     { path: '/orders', name: 'Orders', icon: <FaShoppingCart /> },
//     { path: '/reports', name: 'Reports', icon: <FaListAlt /> },
//   ];

//   return (
//     <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
//       <div className="flex items-center space-x-2 px-4 mb-6">
//         <FaWarehouse className="text-2xl" />
//         <span className="text-2xl font-semibold">WarehouseApp</span>
//       </div>
//       <nav>
//         {menuItems.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             className={({ isActive }) =>
//               `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
//                 isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
//               }`
//             }
//           >
//             {item.icon}
//             <span>{item.name}</span>
//           </NavLink>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;


import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaWarehouse, FaChartLine, FaBoxes } from 'react-icons/fa';


const Sidebar = () => {
  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <FaChartLine /> },
    { path: '/products', name: 'Sản Phẩm', icon: <FaBoxes /> },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex items-center space-x-2 px-4 mb-6">
        <FaWarehouse className="text-2xl" />
        <span className="text-2xl font-semibold">WarehouseApp</span>
      </div>
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
                isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;