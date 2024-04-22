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
