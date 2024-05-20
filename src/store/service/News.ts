interface NewsData {
    name: string;
    image: string;
    text: string;
    type: string;
}

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

export const createNewsOnServer = async (newsData: NewsData) => {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            throw new Error('Token is not available');
        }
        
        const response = await fetch(`${process.env.REACT_APP_API_EDUCATION}/api/news`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newsData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with creating news:', error);
        throw error;
    }
};

export const deleteNewsFromServer = async (newsId: string, token: string | null) => {
    try {
        if (!token) {
            throw new Error('Token is not available');
        }

        const response = await fetch(`${process.env.REACT_APP_API_EDUCATION}/api/deleteNews/${newsId}`, {
            method: 'DELETE',
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
        console.error('There was a problem with deleting news:', error);
        throw error;
    }
};
