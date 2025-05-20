import api from './API';

// Login với plain text password
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Lưu token vào localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register với plain text password
export const register = async (userData) => {
  try {
    // Đảm bảo gửi mật khẩu dạng plain text lên server
    const response = await api.post('/auth/register', userData);
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    return { data: { success: true } };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// // Kiểm tra trạng thái xác thực
export const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await api.get('/auth/status');
    return response;
  } catch (error) {
    console.error('Auth check error:', error);
    throw error;
  }
};




