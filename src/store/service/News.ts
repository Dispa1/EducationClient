export const getAllNewsFromServer = async (token: string | null) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_EDUCATION}/api/getAllNews`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with fetching news:', error);
        return [];
    }
};
