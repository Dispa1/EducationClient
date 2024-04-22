import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const loginUser = async (userData: any) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_EDUCATION}/api/login`, userData);
    
    if (response.status === 200 && response.data.accessToken && response.data.refreshToken) {
      const { accessToken, refreshToken } = response.data;

      const decodedToken: any = jwtDecode(accessToken);

      const { username, full_name, role_id } = decodedToken;

      sessionStorage.setItem('userData', JSON.stringify({ username, full_name, role_id }));
      sessionStorage.setItem('token', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      
      return accessToken;
    } else {
      throw new Error('Ошибка при авторизации');
    }
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    throw error;
  }
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_EDUCATION}/api/refresh-token`, { refreshToken });
    
    if (response.status === 200 && response.data.accessToken) {
      const { accessToken } = response.data;

      sessionStorage.setItem('token', accessToken);
      
      return accessToken;
    } else {
      throw new Error('Ошибка при обновлении токена');
    }
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error);
    throw error;
  }
};