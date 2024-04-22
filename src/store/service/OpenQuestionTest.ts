import axios from 'axios';

export const getAllOpenQuestionTest = async (token: string | null) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_EDUCATION}/api/getAllOpenQuestionTest`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching open question tests: ${error}`);
    }
};

export const getOpenQuestionTestById = async (testId: string, token: string | null) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_EDUCATION}/api/getOpenQuestionTestById/${testId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching open question test by ID: ${error}`);
    }
};

export async function createOpenQuestionTest(testData: any, token: string) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_EDUCATION}/api/createOpenQuestionTest`, testData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 201) {
            return true;
        } else {
            throw new Error('Произошла ошибка при создании теста с открытыми вопросами');
        }
    } catch (error) {
        console.error('Ошибка при создании теста с открытыми вопросами:', error);
        throw error;
    }
}