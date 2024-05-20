import axios from 'axios';

interface Answer {
    questionId: number;
    optionId: number;
}

interface TestResults {
    correctAnswersCount: number;
}

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

export const deleteClosedQuestionTest = async (testId: string, token: string | null) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_EDUCATION}/api/deleteClosedQuestionTest/${testId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Произошла ошибка при удалении теста с закрытыми вопросами');
        }
    } catch (error) {
        console.error('Ошибка при удалении теста с закрытыми вопросами:', error);
        throw error;
    }
};

export const checkAnswers = async (testId: string, userId: string, userName: string, testName: string, answers: Answer[], token: string | null): Promise<TestResults> => {
    try {
        console.log('Sending request to server with data:', { testId, userId, userName, testName, answers });

        const response = await axios.post(
            `${process.env.REACT_APP_API_EDUCATION}/api/checkAnswers/${testId}`,
            { testId, userId, userName, testName, answers },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`Error checking answers: ${error}`);
    }
};