import axios from 'axios';

export const getAllAnalytics = async () => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in session storage');
    }
    const response = await axios.get(
      `${process.env.REACT_APP_API_EDUCATION}/api/AllAnalytics`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении записей аналитики:', error);
    throw new Error('Произошла ошибка при получении записей аналитики');
  }
};

export const createAnalytics = async (data: {
  type: string;
  userId: string;
  userName: string;
  testId: string;
  testName: string;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
}): Promise<void> => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Токен отсутствует');
    }

    await axios.post(`${process.env.REACT_APP_API_EDUCATION}/api/analytics`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    console.error('Ошибка при создании записи аналитики:', error.message);
    throw new Error('Произошла ошибка при создании записи аналитики');
  }
};

export const getAllAnalyticsForUser = async (userId: string) => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in session storage');
    }

    const response = await axios.get(
      `${process.env.REACT_APP_API_EDUCATION}/api/AllAnalytics/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении записей аналитики для пользователя:', error);
    throw new Error('Произошла ошибка при получении записей аналитики для пользователя');
  }
};