import axios from 'axios';

export const getAllClosedQuestionsTest = async (token: string | null) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_EDUCATION}/api/getAllClosedQuestionsTest`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching closed question tests: ${error}`);
    }
};

export const getClosedQuestionTestById = async (testId: string, token: string | null) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_EDUCATION}/api/getClosedQuestionTestById/${testId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching closed question test by ID: ${error}`);
    }
};

export async function createClosedQuestionTest(testData: any, token: string) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_EDUCATION}/api/createClosedQuestionTest`, testData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 201) {
            return true;
        } else {
            throw new Error('Произошла ошибка при создании теста с закрытыми вопросами');
        }
    } catch (error) {
        console.error('Ошибка при создании теста с закрытыми вопросами:', error);
        throw error;
    }
}