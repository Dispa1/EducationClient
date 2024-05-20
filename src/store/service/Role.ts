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

export const getAllRoles = async (token: string | null) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_EDUCATION}/api/getAllRoles`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching roles: ${error}`);
    }
};

export const deleteRole = async (roleId: string, token: string | null) => {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_API_EDUCATION}/api/deleteRole/${roleId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`Error deleting role: ${error}`);
    }
};