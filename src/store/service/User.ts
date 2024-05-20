import axios from 'axios';

export const registerUser = async (userData: any, token: string) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_EDUCATION}/api/register`, userData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Ошибка при регистрации пользователя: ' + error.message);
        } else {
            throw new Error('Неизвестная ошибка при регистрации пользователя');
        }
    }
};

export const getAllUsers = async (token: string) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_EDUCATION}/api/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Ошибка при получении пользователей: ' + error.message);
        } else {
            throw new Error('Неизвестная ошибка при получении пользователей');
        }
    }
};

export const deleteUser = async (userId: string, token: string) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_EDUCATION}/api/deleteUser/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Ошибка при удалении пользователя: ' + error.message);
        } else {
            throw new Error('Неизвестная ошибка при удалении пользователя');
        }
    }
};