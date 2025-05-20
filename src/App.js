import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/pages/Dashboard';
// import Inventory from './components/pages/Inventory';
import Products from './components/pages/Products';
// import Orders from './components/pages/Orders';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProctectedRoute';
import {useAuth} from './context/Authentication';


function App() {
 // Kiểm tra đăng nhập đơn giản (trong thực tế nên sử dụng context cho việc này)
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />

        {/* <Route path="/inventory" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout>
              <Inventory />
            </Layout>
          </ProtectedRoute>
        } /> */}

        <Route path="/products" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout>
              <Products />
            </Layout>
          </ProtectedRoute>
        } />

        {/* <Route path="/orders" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout>
              <Orders />
            </Layout>
          </ProtectedRoute>
        } /> */}
      </Routes>
    </Router>
  );
}

export default App;