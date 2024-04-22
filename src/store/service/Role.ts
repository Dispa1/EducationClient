import axios from 'axios';

export const createRole = async (name: string, token: string | null) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_EDUCATION}/api/createRole`,
            { name },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`Error creating role: ${error}`);
    }
};
