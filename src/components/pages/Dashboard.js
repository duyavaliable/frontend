import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaWarehouse, FaShoppingCart, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';

const Dashboard = () => {
  // Mock data cho mục đích hiển thị
  const stats = [
    { id: 1, title: 'Tổng số sản phẩm', value: 1240, icon: <FaBox />, color: 'bg-blue-500' },
    { id: 2, title: 'Tổng số trong kho', value: 84500, icon: <FaWarehouse />, color: 'bg-green-500' },
    { id: 3, title: 'Đơn hàng đang xử lý', value: 18, icon: <FaShoppingCart />, color: 'bg-yellow-500' },
    { id: 4, title: 'Hàng tồn kho thấp', value: 12, icon: <FaExclamationTriangle />, color: 'bg-red-500' },
  ];

  const recentActivity = [
    { id: 1, action: 'Cập nhật kho', product: 'Điện thoại Samsung Galaxy A52', user: 'Nguyễn Văn A', time: '1 giờ trước' },
    { id: 2, action: 'Thêm sản phẩm mới', product: 'Laptop Dell XPS 13', user: 'Trần Thị B', time: '3 giờ trước' },
    { id: 3, action: 'Xuất kho', product: 'Tai nghe Bluetooth Sony', user: 'Lê Văn C', time: '5 giờ trước' },
    { id: 4, action: 'Điều chỉnh số lượng', product: 'Bàn phím cơ Logitech', user: 'Phạm Thị D', time: '1 ngày trước' },
  ];
  // Thêm mock data cho top sản phẩm
  const topProducts = [
    { id: 1, name: 'iPhone 14 Pro', category: 'Điện thoại', stock: 120, price: 27990000, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Samsung Galaxy S23', category: 'Điện thoại', stock: 85, price: 21990000, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'MacBook Air M2', category: 'Laptop', stock: 45, price: 29990000, image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Apple Watch Series 8', category: 'Đồng hồ', stock: 60, price: 12990000, image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'AirPods Pro 2', category: 'Phụ kiện', stock: 100, price: 6790000, image: 'https://via.placeholder.com/150' },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-6">Tổng quan</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Biểu đồ sản phẩm theo danh mục</h2>
          <div className="h-60 flex items-center justify-center bg-gray-100 rounded">
            <p>Đây là vị trí cho biểu đồ</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Lịch sử xuất nhập kho</h2>
          <div className="h-60 flex items-center justify-center bg-gray-100 rounded">
            <p>Đây là vị trí cho biểu đồ</p>
          </div>
        </div>
      </div>
      
      {/* Thêm phần top sản phẩm */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sản phẩm nổi bật</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center">
            Xem tất cả sản phẩm <FaArrowRight className="ml-1" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={product.image} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(product.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Hoạt động gần đây</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{activity.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{activity.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{activity.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;