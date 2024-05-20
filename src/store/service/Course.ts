export const getAllCourses = async (token: string | null) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_EDUCATION}/api/getAllCourses`, {
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
        console.error('There was a problem with fetching courses:', error);
        return [];
    }
};

export const getCourseById = async (courseId: string, token: string | null) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_EDUCATION}/api/getCourseById/${courseId}`, {
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
      console.error('There was a problem with fetching the course:', error);
      return null;
    }
  };

  export const createCourse = async (courseData: { title: string; image: string; subSections: any[]; description?: string }, token: string | null) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_EDUCATION}/api/createCourse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(courseData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with creating the course:', error);
        return null;
    }
};

export const deleteCourse = async (courseId: string, token: string | null) => {
  try {
      const response = await fetch(`${process.env.REACT_APP_API_EDUCATION}/api/deleteCourse/${courseId}`, {
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
      console.error('There was a problem with deleting the course:', error);
      return null;
  }
};
