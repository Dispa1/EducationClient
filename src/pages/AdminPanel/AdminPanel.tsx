import React, { useState, useEffect, useCallback } from 'react';
import styles from './AdminPanel.module.scss';
import Button from '../../UI/Button/Button';
import Box from '../../UI/Box/Box';
import Input from '../../UI/Input/Input';
import Select from '../../UI/Select/Select';
import Table from '../../UI/Table/Table';
import Checkbox from '../../UI/CheckBox/CheckBox';
import { ReactComponent as GoToMain } from '../../assets/icons/logout.svg';
import { useNavigate } from 'react-router-dom';
import { createRole } from '../../store/service/Role';
import { registerUser } from '../../store/service/User';
import { createCourse, deleteCourse } from '../../store/service/Course';
import { createOpenQuestionTest, deleteOpenQuestionTest } from '../../store/service/OpenQuestionTest';
import { createClosedQuestionTest, deleteClosedQuestionTest } from '../../store/service/CloseQuestionTest';
import { getAllRoles, deleteRole } from '../../store/service/Role';
import { getAllUsers, deleteUser } from '../../store/service/User';
import { createNewsOnServer, deleteNewsFromServer, getAllNewsFromServer } from '../../store/service/News';
import { getAllCourses } from '../../store/service/Course';
import { getAllOpenQuestionTest } from '../../store/service/OpenQuestionTest';
import { getAllClosedQuestionsTest } from '../../store/service/CloseQuestionTest';
import { getAllUserTestResults } from '../../store/service/OpenQuestionTest';
import { getAllAnalytics } from '../../store/service/Analytics';
import { ChangeEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import 'github-markdown-css/github-markdown.css';

import { Doughnut } from 'react-chartjs-2';

import axios from 'axios';

import { ReactComponent as Info } from '../../assets/icons/info.svg';
import { ReactComponent as RoleIcon } from '../../assets/icons/department.svg';
import { ReactComponent as UserIcon } from '../../assets/icons/users-alt.svg';
import { ReactComponent as Cours } from '../../assets/icons/diploma.svg';
import { ReactComponent as QuestionsOpen } from '../../assets/icons/question.svg';
import { ReactComponent as QuestionsClosed } from '../../assets/icons/question-square.svg';
import { ReactComponent as Adminpanel } from '../../assets/icons/admin_panel_a0ujqynapbic.svg';
import { ReactComponent as Delete } from '../../assets/icons/delete.svg';
import { ReactComponent as News } from '../../assets/icons/newspaper.svg';
import { ReactComponent as Next } from '../../assets/icons/angle-double-right.svg';
import { ReactComponent as Answer } from '../../assets/icons/answer-alt.svg';
import { ReactComponent as Statistics } from '../../assets/icons/chart-user.svg';

interface Subsection {
    name: string;
    image: string;
    text: string;
}

interface OpenQuestion {
    questionText: string;
    correctAnswer: string;
}

interface ClosedQuestionOption {
    text: string;
    isCorrect: boolean;
}

interface ClosedQuestion {
    questionText: string;
    options: ClosedQuestionOption[];
}

interface Role {
    id: string;
    name: string;
    createdAt: string;
}

interface User {
    id: string;
    username: string;
    full_name: string;
    email: string;
    role?: {
        id: string;
        name: string;
    };
    createdAt: string;
} 

interface Course {
    id: string;
    title: string;
    description: string;
    image: string;
    sections: Subsection[];
    createdAt: string;
}

interface OpenQuestionTest {
    id: string;
    name: string;
    description: string;
    time: number;
    questions: OpenQuestion[];
    createdAt: string;
}

interface ClosedQuestionTest {
    id: string;
    name: string;
    description: string;
    time: number;
    questions: ClosedQuestion[];
    createdAt: string;
}

interface News {
    id: string;
    name: string;
    image: string;
    text: string;
    type: string;
    createdAt: string;
}

interface UserTestResult {
    id: string;
    userId: string;
    testId: string;
    full_name: string;
    testName: number;
    createdAt: string;
}

interface Analytics {
    id: string;
    type: string;
    userId: string;
    userName: string;
    testName: string;
    correctAnswersCount: number;
    incorrectAnswersCount: number;
    unansweredQuestionsCount: number;
    testId: string;
    createdAt: string;
}

const AdminPanel = () => {
    const [activeItem, setActiveItem] = useState<number>(0);
    const [roleName, setRoleName] = useState<string>('');
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // const [image, setImage] = useState('');
    // const [sectionInputs, setSectionInputs] = useState<Subsection[]>([{ name: '', image: '', text: '' }]);
    const [openQuestions, setOpenQuestions] = useState<OpenQuestion[]>([]);
    const [closedQuestions, setClosedQuestions] = useState<ClosedQuestion[]>([]);
    const [questionText, setQuestionText] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [time, setTime] = useState<number>(0);
    const [closedQuestionText, setClosedQuestionText] = useState('');
    const [closedOptions, setClosedOptions] = useState<ClosedQuestionOption[]>([{ text: '', isCorrect: false }]);
    const [options, setOptions] = useState<ClosedQuestionOption[]>([{ text: '', isCorrect: false }]);
    const [closedTestTime, setClosedTestTime] = useState<number>(0);
    const [activeItemCourse, setActiveItemCourse] = useState<number>(0);
    const navigate = useNavigate();
    const [news, setNews] = useState<News[]>([]);
    const [userTestResults, setUserTestResults] = useState<UserTestResult[]>([]);

    const [newsName, setNewsName] = useState('');
    const [newsImage, setNewsImage] = useState('');
    const [newsText, setNewsText] = useState('');
    const [newsType, setNewsType] = useState('');


    const [roles, setRoles] = useState<Role[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [openQuestionTests, setOpenQuestionTests] = useState<OpenQuestionTest[]>([]);
    const [closedQuestionTests, setClosedQuestionTests] = useState<ClosedQuestionTest[]>([]);
    const [loading, setLoading] = useState(true);

    const [markdownContent, setMarkdownContent] = useState('');

    const [analytics, setAnalytics] = useState<Analytics[]>([]);
    const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setAnalyticsLoading(true);
            try {
                const analyticsData = await getAllAnalytics();
                setAnalytics(analyticsData);
            } catch (error) {
                console.error('Ошибка при получении записей аналитики:', error);
            } finally {
                setAnalyticsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);
    
    const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setDescription(value);
        setMarkdownContent(value);
    };    

    const [value, setValue] = useState("");

    const handleItemClickCourse = (index: number) => {
        setActiveItemCourse(index);
    };

    const handleNextClick = (id: string) => {
        navigate(`/FullAnswer/${id}`);
    };    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    throw new Error('Токен отсутствует');
                }
                const newsData = await getAllNewsFromServer(token);
                setNews(newsData);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при получении новостей:', error);
                alert('Произошла ошибка при получении новостей');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    throw new Error('Токен отсутствует');
                }
                const rolesData = await getAllRoles(token);
                setRoles(rolesData);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при получении ролей:', error);
                alert('Произошла ошибка при получении ролей');
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    throw new Error('Токен отсутствует');
                }
                const usersData = await getAllUsers(token);
                setUsers(usersData);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при получении пользователей:', error);
                alert('Произошла ошибка при получении пользователей');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    throw new Error('Токен отсутствует');
                }
                const coursesData = await getAllCourses(token);
                setCourses(coursesData);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при получении курсов:', error);
                alert('Произошла ошибка при получении курсов');
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const fetchOpenQuestionTests = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    throw new Error('Токен отсутствует');
                }
                const openQuestionTestsData = await getAllOpenQuestionTest(token);
                setOpenQuestionTests(openQuestionTestsData);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при получении тестов с открытыми вопросами:', error);
                alert('Произошла ошибка при получении тестов с открытыми вопросами');
                setLoading(false);
            }
        };

        fetchOpenQuestionTests();
    }, []);

    useEffect(() => {
        const fetchClosedQuestionTests = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    throw new Error('Токен отсутствует');
                }
                const closedQuestionTestsData = await getAllClosedQuestionsTest(token);
                setClosedQuestionTests(closedQuestionTestsData);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при получении тестов с закрытыми вопросами:', error);
                alert('Произошла ошибка при получении тестов с закрытыми вопросами');
                setLoading(false);
            }
        };
    
        fetchClosedQuestionTests();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    throw new Error('Токен отсутствует');
                }
                const data = await getAllUserTestResults(token);
                setUserTestResults(data);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при получении результатов тестов:', error);
                alert('Произошла ошибка при получении результатов тестов');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCreateNews = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }
    
            const newsData = { name: newsName, image: newsImage, text: newsText, type: newsType };
            const createdNews = await createNewsOnServer(newsData);
    
            const updatedNews = await getAllNewsFromServer(token);
    
            setNews(updatedNews);
            setNewsName('');
            setNewsImage('');
            setNewsText('');
            setNewsType('');
            alert('Новость успешно создана!');
        } catch (error) {
            console.error('Ошибка при создании новости:', error);
            alert('Произошла ошибка при создании новости');
        }
    };    
    
    const handleDeleteNews = async (newsId: string) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }
            await deleteNewsFromServer(newsId, token);
            const updatedNews = news.filter(newsItem => newsItem.id !== newsId);
            setNews(updatedNews);
            alert('Новость успешно удалена!');
        } catch (error) {
            console.error('Ошибка при удалении новости:', error);
            alert('Произошла ошибка при удалении новости');
        }
    };

    const handleDeleteRole = async (roleId: string) => {
        try {
          const token = sessionStorage.getItem('token');
          if (!token) {
            throw new Error('Токен отсутствует');
          }
          await deleteRole(roleId, token);
          alert('Роль успешно удалена!');
        } catch (error) {
          console.error('Ошибка при удалении роли:', error);
          alert('Произошла ошибка при удалении роли');
        }
      };

      const handleDeleteUser = async (userId: string) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }
            await deleteUser(userId, token);
            alert('Пользователь успешно удален!');
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
            alert('Произошла ошибка при удалении пользователя');
        }
    };

    const redirectToMainPage = () => {
        navigate('/');
    };

    const handleItemClick = (index: number) => {
        setActiveItem(index);
    };

    const handleCreateRole = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }
            await createRole(roleName, token);
            alert('Роль успешно создана!');
        } catch (error) {
            console.error('Ошибка при создании роли:', error);
            alert('Произошла ошибка при создании роли');
        }
    };

    const handleCreateUser = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }
            await registerUser({ username, password, full_name: fullName, email }, token);
            setUsername('');
            setPassword('');
            setFullName('');
            setEmail('');
            alert('Пользователь успешно создан!');
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
            alert('Произошла ошибка при создании пользователя');
        }
    };

    // const handleCreateCourse = async () => {
    //     try {
    //         const token = sessionStorage.getItem('token');
    //         if (!token) {
    //             throw new Error('Токен отсутствует');
    //         }
    //         const courseData = {
    //             title,
    //             description,
    //             image,
    //             subSections: sectionInputs,
    //         };
    //         await createCourse(courseData, token);
    //         setTitle('');
    //         setDescription('');
    //         setImage('');
    //         setSectionInputs([{ name: '', image: '', text: '' }]);
    //         alert('Курс успешно создан!');
    //     } catch (error) {
    //         console.error('Ошибка при создании курса:', error);
    //         alert('Произошла ошибка при создании курса');
    //     }
    // };      

    const [image, setImage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [sectionInputs, setSectionInputs] = useState([{ name: '', image: '', text: '' }]);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleCreateCourse = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (file) {
                formData.append('image', file);
            }
            formData.append('subSections', JSON.stringify(sectionInputs));

            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }

            const response = await axios.post(`${process.env.REACT_APP_API_EDUCATION}/api/createCourse`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setTitle('');
            setDescription('');
            setSectionInputs([{ name: '', image: '', text: '' }]);
            setFile(null);
            alert('Курс успешно создан!');
        } catch (error) {
            console.error('Ошибка при создании курса:', error);
            alert('Произошла ошибка при создании курса');
        }
    };

    const handleDeleteCourse = async (courseId: string) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }
            await deleteCourse(courseId, token);
            alert('Курс успешно удален!');
            const updatedCourses = await getAllCourses(token);
            setCourses(updatedCourses);
        } catch (error) {
            console.error('Ошибка при удалении курса:', error);
            alert('Произошла ошибка при удалении курса');
        }
    };

    const handleDeleteOpenQuestionTest = async (testId: string) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }
            await deleteOpenQuestionTest(testId, token);
            alert('Тест с открытыми вопросами успешно удален!');
            const updatedOpenQuestionTests = openQuestionTests.filter(test => test.id !== testId);
            setOpenQuestionTests(updatedOpenQuestionTests);
        } catch (error) {
            console.error('Ошибка при удалении теста с открытыми вопросами:', error);
            alert('Произошла ошибка при удалении теста с открытыми вопросами');
        }
    };

    const handleDeleteClosedQuestionTest = async (testId: string) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }
            await deleteClosedQuestionTest(testId, token);
            alert('Тест с закрытыми вопросами успешно удален!');
            const updatedClosedQuestionTests = closedQuestionTests.filter(test => test.id !== testId);
            setClosedQuestionTests(updatedClosedQuestionTests);
        } catch (error) {
            console.error('Ошибка при удалении теста с закрытыми вопросами:', error);
            alert('Произошла ошибка при удалении теста с закрытыми вопросами');
        }
    };

    const handleAddSection = () => {
        setSectionInputs([...sectionInputs, { name: '', image: '', text: '' }]);
    };

    const handleRemoveSection = (index: number) => {
        const updatedSectionInputs = [...sectionInputs];
        updatedSectionInputs.splice(index, 1);
        setSectionInputs(updatedSectionInputs);
    };

    const handleSectionChange = (index: number, field: keyof Subsection, value: string) => {
        const updatedSectionInputs = [...sectionInputs];
        updatedSectionInputs[index][field] = value;
        setSectionInputs(updatedSectionInputs);
    };    

    const handleAddOpenQuestion = () => {
        if (questionText.trim() === '' || correctAnswer.trim() === '') {
            alert('Пожалуйста, заполните текст вопроса и правильный ответ');
            return;
        }
        setOpenQuestions([...openQuestions, { questionText, correctAnswer }]);
        setQuestionText('');
        setCorrectAnswer('');
    };

    const handleRemoveOpenQuestion = (index: number) => {
        const updatedOpenQuestions = [...openQuestions];
        updatedOpenQuestions.splice(index, 1);
        setOpenQuestions(updatedOpenQuestions);
    };

    const handleCreateOpenQuestionTest = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }
            const testData = {
                name: title,
                description,
                test: openQuestions,
                time,
            };
            const success = await createOpenQuestionTest(testData, token);
            if (success) {
                alert('Тест с открытыми вопросами успешно создан!');
                setTitle('');
                setDescription('');
                setOpenQuestions([]);
                setTime(0);
            }
        } catch (error) {
            console.error('Ошибка при создании теста с открытыми вопросами:', error);
            alert('Произошла ошибка при создании теста с открытыми вопросами');
        }
    };

    const handleCreateClosedQuestionTest = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }
            
            const test = {
                name: title,
                description,
                test: closedQuestions,
                time: closedTestTime,
            };
    
            const response = await axios.post(`${process.env.REACT_APP_API_EDUCATION}/api/createClosedQuestionTest`, test, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.status === 201) {
                alert('Тест с закрытыми вопросами успешно создан!');
                setTitle('');
                setDescription('');
                setClosedQuestions([]);
                setClosedTestTime(0);
            } else {
                throw new Error('Произошла ошибка при создании теста с закрытыми вопросами');
            }
        } catch (error) {
            console.error('Ошибка при создании теста с закрытыми вопросами:', error);
            alert('Произошла ошибка при создании теста с закрытыми вопросами');
        }
    }; 

    const handleRemoveClosedQuestion = (index: number) => {
        const updatedClosedQuestions = [...closedQuestions];
        updatedClosedQuestions.splice(index, 1);
        setClosedQuestions(updatedClosedQuestions);
    };
    
    const handleAddOption = () => {
        setOptions([...options, { text: '', isCorrect: false }]);
    };
    
    const handleRemoveOption = (index: number) => {
        const updatedOptions = [...options];
        updatedOptions.splice(index, 1);
        setOptions(updatedOptions);
    };
    
    const handleOptionChange = (index: number, field: keyof ClosedQuestionOption, value: string | boolean) => {
        const updatedOptions = [...options];
        (updatedOptions[index][field] as string | boolean) = value;
        setOptions(updatedOptions);
    };
    
    const handleAddClosedQuestion = () => {
        if (questionText.trim() === '') {
            alert('Пожалуйста, заполните текст вопроса');
            return;
        }
    
        if (options.length === 0 || options.every(option => option.text.trim() === '')) {
            alert('Пожалуйста, добавьте хотя бы один вариант ответа');
            return;
        }
    
        if (!options.some(option => option.isCorrect)) {
            alert('Пожалуйста, отметьте хотя бы один вариант ответа как правильный');
            return;
        }
    
        const newQuestion: ClosedQuestion = {
            questionText: questionText,
            options: options,
        };
        setClosedQuestions([...closedQuestions, newQuestion]);
        
        setQuestionText('');
        setOptions([{ text: '', isCorrect: false }]);
    };    

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        const formattedTime = date.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return `${formattedDate}, ${formattedTime}`;
      };      

      const chartOptions = {
        plugins: {
          legend: {
            position: 'bottom' as const,
            align: 'start' as const,
          },
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem: any, data: any) {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const currentValue = dataset.data[tooltipItem.index];
              return `${data.labels[tooltipItem.index]}: ${currentValue}`;
            },
          },
        },
      };      

    return (
        <div className={styles.wrapper}>
            <div className={styles.SideBar}>
                <Box>
                    <div className={styles.GoBackToTheMainPage}>
                        <Button type="submit" variant="normal" onClick={redirectToMainPage}>
                            <div className={styles.GoToMain}>
                                <GoToMain title=""/>
                            </div>
                            Основная страница
                        </Button>
                    </div>
                    <ul className={styles.SideBarList}>
                        <li className={activeItem === 0 ? styles.active : ''} onClick={() => handleItemClick(0)}><div className={styles.sideBarListCenter}><Info/><p>Информация</p></div><div className={styles.line}></div></li>
                        <li className={activeItem === 1 ? styles.active : ''} onClick={() => handleItemClick(1)}><div className={styles.sideBarListCenter}><News/><p>Новости</p></div><div className={styles.line}></div></li>
                        <li className={activeItem === 2 ? styles.active : ''} onClick={() => handleItemClick(2)}><div className={styles.sideBarListCenter}><RoleIcon/><p>Роли</p></div><div className={styles.line}></div></li>
                        <li className={activeItem === 3 ? styles.active : ''} onClick={() => handleItemClick(3)}><div className={styles.sideBarListCenter}><UserIcon/><p>Пользователи</p></div><div className={styles.line}></div></li>
                        <li className={activeItem === 4 ? styles.active : ''} onClick={() => handleItemClick(4)}><div className={styles.sideBarListCenter}><Cours/><p>Курсы</p></div><div className={styles.line}></div></li>
                        <li className={activeItem === 5 ? styles.active : ''} onClick={() => handleItemClick(5)}><div className={styles.sideBarListCenter}><QuestionsOpen/><p>Открытые вопросы</p></div><div className={styles.line}></div></li>
                        <li className={activeItem === 6 ? styles.active : ''} onClick={() => handleItemClick(6)}><div className={styles.sideBarListCenter}><Answer/><p>Ответы пользователей</p></div><div className={styles.line}></div></li>
                        <li className={activeItem === 7 ? styles.active : ''} onClick={() => handleItemClick(7)}><div className={styles.sideBarListCenter}><QuestionsClosed/><p>Закрытые вопросы</p></div><div className={styles.line}></div></li>
                        <li className={activeItem === 8 ? styles.active : ''} onClick={() => handleItemClick(8)}><div className={styles.sideBarListCenter}><Statistics/><p>Статистика пользователей</p></div><div className={styles.line}></div></li>
                    </ul>
                </Box>
            </div>
            <div className={styles.Tabs}>
                <div className={styles.List}>
                    <div className={`${styles.News} ${activeItem === 0 ? styles.active : ''}`}>
                        <div className={styles.TitleIconTextBody}> 
                        <div className={styles.TitleIconBody}>
                            <div className={styles.infoHeader}>
                            Админ панель модуля "Обучения и развития"
                            </div>
                            <div className={styles.Text}>
                        Административная панель модуля "Обучения и развития" представляет собой 
                        централизованный инструмент управления образовательными процессами и развитием 
                        персонала в организации. Этот функциональный инструмент предназначен для администраторов 
                        и ответственных лиц, занимающихся обучением, чтобы обеспечить эффективное управление системой обучения и развития персонала.
                        </div>
                        </div>
                        <div className={styles.InfoIcon}>
                            <Adminpanel />
                            </div>
                        </div>
                        
                        </div>

                        <div className={`${styles.News} ${activeItem === 1 ? styles.active : ''}`}>
                        <div className={styles.RoleTitle}><p>Новости</p></div>
                        <div className={styles.QuestionsBody}>
                            <div className={styles.CreateQuestions}>
                            <Box>
                                <div className={styles.CreateQuestionsTitle}>
                                    Создание новости
                                </div>
                                <form onSubmit={(e) => { e.preventDefault(); handleCreateNews(); }}>
                                    <Input 
                                        type="text" 
                                        value={newsName} 
                                        onChange={(e) => setNewsName(e.target.value)} 
                                        placeholder="Введите заголовок новости" 
                                    />
                                    <Input 
                                        type="text" 
                                        value={newsImage} 
                                        onChange={(e) => setNewsImage(e.target.value)} 
                                        placeholder="Введите URL изображения новости" 
                                    />
                                    <Input 
                                        type="text" 
                                        value={newsText} 
                                        onChange={(e) => setNewsText(e.target.value)} 
                                        placeholder="Введите текст новости" 
                                    />
                                    <Input 
                                        type="text" 
                                        value={newsType} 
                                        onChange={(e) => setNewsType(e.target.value)} 
                                        placeholder="Введите тип новости" 
                                    />
                                    <Button type="submit" variant="normal">Создать</Button>
                                </form>
                            </Box>
                            </div>
                            <div className={styles.QuestionsTableRole}>
                            <Box>
                                {loading ? (
                                    <p>Загрузка...</p>
                                ) : (
                                    <Table
                                        tbodyClassName={styles.TableBodyNews}
                                        headers={['№', 'Заголовок', 'Текст', 'Тип', 'Дата', '']}
                                        data={news.map((newsItem, index) => [
                                            index+1,
                                            newsItem.name,
                                            newsItem.text,
                                            newsItem.type,
                                            new Date(newsItem.createdAt).toLocaleDateString('ru-RU', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }),
                                            <Delete onClick={() => handleDeleteNews(newsItem.id)} />
                                        ])}
                                    />
                                )}
                            </Box>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.News} ${activeItem === 2 ? styles.active : ''}`}>
                        <div className={styles.RoleTitle}><p>Роли</p></div>
                        <div className={styles.QuestionsBody}>
                            <div className={styles.CreateQuestions}>
                                <Box>
                                    <div className={styles.CreateQuestionsTitle}>
                                        Создание новой роли
                                    </div>
                                    <form onSubmit={(e) => { e.preventDefault(); handleCreateRole(); }}>
                                            <Input 
                                                type="text" 
                                                value={roleName} 
                                                onChange={(e) => setRoleName(e.target.value)} 
                                                placeholder="Введите название роли" 
                                            />
                                        <Button type="submit" variant="normal">Создать</Button>
                                    </form>
                                </Box>
                            </div>
                            <div className={styles.QuestionsTableRole}>
                                <Box>
                                    {loading ? (
                                        <p>Загрузка...</p>
                                    ) : (
                                        <Table
                                            tbodyClassName={styles.TableBodyRole}
                                            headers={['№', 'Название', 'Дата', '']}
                                            data={roles.map((role, index) => [
                                                index+1,
                                                role.name, 
                                                new Date(role.createdAt).toLocaleDateString('ru-RU', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }),
                                                <Delete onClick={() => handleDeleteRole(role.id)} />])}
                                        />
                                    )}
                                </Box>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.News} ${activeItem === 3 ? styles.active : ''}`}>
                    <div className={styles.RoleTitle}><p>Пользователи</p></div>
                        <div className={styles.QuestionsBody}>
                            <div className={styles.CreateQuestions}>
                                <Box>
                                <div className={styles.CreateQuestionsTitle}>
                                        Создание нового пользователя
                                    </div>
                                    <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }}>
                                        <Input 
                                            type="text" 
                                            value={username} 
                                            onChange={(e) => setUsername(e.target.value)} 
                                            placeholder="Имя пользователя" 
                                        />
                                        <Input 
                                            type="password" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            placeholder="Пароль" 
                                        />
                                        <Input 
                                            type="text" 
                                            value={fullName} 
                                            onChange={(e) => setFullName(e.target.value)} 
                                            placeholder="Полное имя" 
                                        />
                                        <Input 
                                            type="email" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            placeholder="Email" 
                                        />
                                        <Button type="submit" variant="normal">Создать пользователя</Button>
                                    </form>
                                </Box>
                            </div>
                            <div className={styles.QuestionsTableRole}>
                                <Box>
                                    {loading ? (
                                        <p>Загрузка...</p>
                                    ) : (
                                        <Table
                                            tbodyClassName={styles.TableBodyUsers}
                                            headers={['№', 'Имя пользователя', 'Полное имя', 'Email', 'Роль', 'Дата', '']}
                                            data={users.map((user, index) => [
                                                (index + 1).toString(), 
                                                user.username, 
                                                user.full_name, 
                                                user.email, 
                                                user.role ? user.role.name : '', 
                                                new Date(user.createdAt).toLocaleDateString('ru-RU', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }),
                                                <Delete onClick={() => handleDeleteUser(user.id)}/>])}
                                        />
                                    )}
                                </Box>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.News} ${activeItem === 4 ? styles.active : ''}`}>
        <div className={styles.RoleTitle}><p>Курсы</p></div>
        <div className={styles.QuestionsBodyCours}>
            <div className={styles.tabs}>
                <Box>
                    <div className={styles.tabsBody}>
                        <div className={`${styles.tab} ${activeItemCourse === 0 ? styles.active : ''}`} onClick={() => handleItemClickCourse(0)}>
                            <div>Создать курс</div>
                            <div className={styles.line}></div>
                        </div>
                        <div className={`${styles.tab} ${activeItemCourse === 1 ? styles.active : ''}`} onClick={() => handleItemClickCourse(1)}>
                            <div>Список курсов</div>
                            <div className={styles.line}></div>
                        </div>
                    </div>
                </Box>
            </div>

            <div className={`${styles.CreateQuestionsCours} ${activeItemCourse === 0 ? styles.active : ''}`}>
                <Box>
                    <div className={styles.CreateQuestionsTitle}>
                        <div className={styles.CourseHeader}>Создание нового курса</div>
                        <div className={styles.CourseHeaderButtons}></div>
                    </div>
                    <div className={styles.CoursForm}>
                        <div className={styles.chapter}>
                            <div className={styles.NameImageBlock}>
                                <Input 
                                    type="text" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    placeholder="Название курса" 
                                />
                                 <Input
                                  type="file"
                                  onChange={handleFileChange}
                                />
                            </div>
                            <div className={styles.markupEditors}>
                                <textarea
                                    className={styles.CustomTextareaClassDescription}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Описание курса"
                                />
                            </div>
                        </div>
                        <div className={styles.CreateQuestionsTitle}>
                            Создание разделов для курсов
                        </div>
                        {sectionInputs.map((section, index) => (
                            <div className={styles.chapter} key={index}>
                                <div className={styles.NameImageBlock}>
                                    <Input 
                                        type="text" 
                                        value={section.name} 
                                        onChange={(e) => handleSectionChange(index, 'name', e.target.value)} 
                                        placeholder="Название раздела" 
                                    />
                                    {/* <Input 
                                        type="text" 
                                        value={section.image} 
                                        onChange={(e) => handleSectionChange(index, 'image', e.target.value)} 
                                        placeholder="URL изображения раздела" 
                                    /> */}
                                </div>
                                <div className={styles.markupEditors}>
                                    <div className={styles.tagsDescription}>Описание</div>
                                    <div className={styles.tagsDescription}>Предпросмотр</div>
                                </div>
                                <div className={styles.markupEditors}>
                                    <textarea
                                        className={styles.CustomTextareaClass}
                                        value={section.text}
                                        onChange={(e) => handleSectionChange(index, 'text', e.target.value)}
                                        placeholder="Описание раздела"
                                    />
                                    <ReactMarkdown children={section.text} className={styles.CustomTextareaClass} remarkPlugins={[gfm]}></ReactMarkdown>
                                </div>
                                <Button type="button" variant="danger" onClick={() => handleRemoveSection(index)}>Удалить раздел</Button>
                            </div>
                        ))}
                        
                    </div>
                    <div className={styles.futerButtonsCours}>
                            <Button type="button" variant="normal" onClick={handleAddSection}>Добавить раздел</Button>
                            <Button type="button" variant="success" onClick={handleCreateCourse}>Создать курс</Button>
                        </div>
                </Box>
            </div>

            <div className={`${styles.QuestionsCours} ${activeItemCourse === 1 ? styles.active : ''}`}>
                <Box>
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : (
                        <Table
                            tbodyClassName={styles.TableBodyCours}
                            headers={['№', 'Название курса', 'Описание', 'Дата', '']}
                            data={courses.map((course, index) => [
                                index+1,
                                course.title, 
                                course.description,
                                new Date(course.createdAt).toLocaleDateString('ru-RU', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }), 
                                <Delete onClick={() => handleDeleteCourse(course.id)}/>])}
                        />
                    )}
                </Box>
            </div>
        </div> 
    </div>

                    <div className={`${styles.News} ${activeItem === 5 ? styles.active : ''}`}>
                    <div className={styles.RoleTitle}><p>Тестирование с открытыми вопросами</p></div>
                    <div className={styles.QuestionsBodyCloseOpen}>
                        <div className={styles.CreateQuestionsCloseOpen}>
                            <Box>
                                <div className={styles.CreateQuestionsTitle}>
                                            Создание нового тестирования
                                        </div>
                                <form onSubmit={(e) => { e.preventDefault(); handleCreateOpenQuestionTest(); }}>
                                    <Input 
                                        type="text" 
                                        placeholder="Название теста" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                    />
                                    <Input 
                                        type="text" 
                                        placeholder="Описание теста" 
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)} 
                                    />
                                    <Input 
                                        type="number" 
                                        placeholder="Время на тест (в минутах)" 
                                        value={time} 
                                        onChange={(e) => setTime(Number(e.target.value))} 
                                    />
                                    <div className={styles.CreateQuestionsTitle}>
                                            Создание открытых вопросов
                                        </div>
                                    <div className={styles.chapterSckrollOpenQuestions}>
                                        {openQuestions.map((question, index) => (
                                            <div key={index}>
                                                <p><strong>Вопрос:</strong> {question.questionText}</p>
                                                <p><strong>Правильный ответ:</strong> {question.correctAnswer}</p>
                                                <Button type="button" variant="danger" onClick={() => handleRemoveOpenQuestion(index)}>Удалить</Button>
                                            </div>
                                        ))}
                                        <Input 
                                            type="text" 
                                            placeholder="Текст вопроса" 
                                            value={questionText} 
                                            onChange={(e) => setQuestionText(e.target.value)} 
                                        />
                                        <Input 
                                            type="text" 
                                            placeholder="Правильный ответ" 
                                            value={correctAnswer} 
                                            onChange={(e) => setCorrectAnswer(e.target.value)} 
                                        />
                                    </div>
                                    <div className={styles.ButtonBody}>
                                    <Button type="button" variant="normal" onClick={handleAddOpenQuestion}>Добавить вопрос</Button>
                                    </div>
                                    <div className={styles.CreateButton}>
                                    <Button type="submit" variant="success">Создать тест</Button>
                                    </div>
                                </form> 
                            </Box>
                        </div>
                        <div className={styles.QuestionsCloseOpen}>
                            <Box>
                                <div className={styles.CreateQuestionsTitle}>
                                    Список тестов с открытыми вопросами
                                </div>
                                {loading ? (
                                    <p>Загрузка...</p>
                                ) : (
                                    <Table
                                    tbodyClassName={styles.TableBodyOpenTest}
                                        headers={['№', 'Название теста', 'Описание', 'Время на тест', 'Дата', '']}
                                        data={openQuestionTests.map((test, index) => [
                                            index+1,
                                            test.name, 
                                            test.description, 
                                            test.time.toString(), 
                                            new Date(test.createdAt).toLocaleDateString('ru-RU', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }),
                                            <Delete onClick={() => handleDeleteOpenQuestionTest(test.id)}/>])}
                                    />
                                )}
                            </Box>
                        </div>
                    </div>
                    </div>

                    <div className={`${styles.News} ${activeItem === 6 ? styles.active : ''}`}>
                    <div className={styles.RoleTitle}><p>Ответы пользователей на открытые вопросы</p></div>
                        <div className={styles.QuestionsBodyCloseOpen}>
                            
                            <div className={styles.QuestionsCloseOpen}>
                                <Box>
                                    <div className={styles.CreateQuestionsTitle}>
                                        Список ответов пользователей на открытые вопросы
                                    </div>
                                    {loading ? (
                                        <p>Загрузка...</p>
                                    ) : (
                                        <Table
                                            tbodyClassName={styles.TableBodyOpenTestResult}
                                            headers={['№', 'ID сессии', 'Полное имя', 'Название теста', 'Дата', '']}
                                            data={userTestResults.map((result, index) => {
                                                return [
                                                    index + 1,
                                                    result.id,
                                                    result.full_name,
                                                    result.testName,
                                                    new Date(result.createdAt).toLocaleDateString('ru-RU', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }),
                                                    <Next className={styles.NextSVG} onClick={() => handleNextClick(result.id)} title="Открыть ответы пользователя" />
                                                ];
                                            })}
                                        />
                                    )}
                                </Box>
                            </div>
                        </div>
                        </div>

                        <div className={`${styles.News} ${activeItem === 7 ? styles.active : ''}`}>
                    <div className={styles.RoleTitle}><p>Тестирование с закрытыми вопросами</p></div>
                        <div className={styles.QuestionsBodyCloseOpen}>
                            <div className={styles.CreateQuestionsCloseOpen}>
                                <Box>
                                <div className={styles.CreateQuestionsTitle}>
                                            Создание нового тестирования
                                        </div>
                                <form onSubmit={(e) => { e.preventDefault(); handleCreateClosedQuestionTest(); }}>
                                    <Input 
                                        type="text" 
                                        placeholder="Название теста" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                    />
                                    <Input 
                                        type="text" 
                                        placeholder="Описание теста" 
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)} 
                                    />
                                     <Input 
                                        type="number" 
                                        placeholder="Время на тест (в минутах)" 
                                        value={closedTestTime} 
                                        onChange={(e) => setClosedTestTime(Number(e.target.value))} 
                                    />
                                     <div className={styles.CreateQuestionsTitle}>
                                            Создание вопросов
                                        </div>
                                        
                                    <div className={styles.chapterSckrollClosedQuestions}>
                                    {closedQuestions.map((question, index) => (
                                        <div key={index}>
                                            <p><strong>Вопрос:</strong> {question.questionText}</p>
                                            <div>
                                                {question.options.map((option, optionIndex) => (
                                                    <div key={optionIndex}>
                                                        {option.text} - {option.isCorrect ? 'Правильный ответ' : 'Неправильный ответ'}
                                                    </div>
                                                ))}
                                            </div>
                                            <Button type="button" variant="success" onClick={() => handleRemoveClosedQuestion(index)}>Удалить</Button>
                                        </div>
                                    ))}
                                    <Input 
                                        type="text" 
                                        placeholder="Текст вопроса" 
                                        value={questionText} 
                                        onChange={(e) => setQuestionText(e.target.value)} 
                                    />
                                    <div className={styles.answerOptions}>
                                    <div className={styles.CreateQuestionsTitle}>
                                            Варианты ответа
                                        </div>
                                        {options.map((option, index) => (
                                            <div className={styles.answerOptions} key={index}>
                                                <Input 
                                                    type="text" 
                                                    placeholder={`Вариант ответа ${index + 1}`} 
                                                    value={option.text} 
                                                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)} 
                                                />
                                                <label className={styles.CheckBoxLabel}>
                                                <div>
                                                    Правильный ответ
                                                </div>
                                                <Checkbox 
                                                    checked={option.isCorrect}
                                                    onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                                                    // label="Правильный ответ"
                                                />
                                                </label>
                                                <Button type="button" variant="danger" onClick={() => handleRemoveOption(index)}>Удалить</Button>
                                            </div>
                                        ))}
                                    </div>
                                    </div>
                                    <div className={styles.ButtonBody}>
                                    <Button type="button" variant="normal" onClick={handleAddOption}>Добавить вариант ответа</Button>
                                    <Button type="button" variant="normal" onClick={handleAddClosedQuestion}>Добавить вопрос</Button>
                                    </div>
                                    <div className={styles.CreateButton}>
                                    <Button type="submit" variant="success">Создать тест</Button>
                                    </div>
                                </form>
                                </Box>
                            </div>
                            <div className={styles.QuestionsCloseOpen}>
                                <Box>
                                    <div className={styles.CreateQuestionsTitle}>
                                        Список тестов с закрытыми вопросами
                                    </div>
                                    {loading ? (
                                        <p>Загрузка...</p>
                                    ) : (
                                        <Table
                                            tbodyClassName={styles.TableBodyCloseTest}
                                            headers={['№', 'Название теста', 'Описание', 'Время на тест', 'Дата', '']}
                                            data={closedQuestionTests.map((test, index) => [
                                                index + 1,
                                                test.name,
                                                test.description,
                                                test.time.toString(),
                                                new Date(test.createdAt).toLocaleDateString('ru-RU', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }),
                                                <Delete onClick={() => handleDeleteClosedQuestionTest(test.id)} />
                                            ])}
                                        />
                                    )}
                                </Box>
                            </div>
                        </div>
                        </div>

                        <div className={`${styles.News} ${activeItem === 8 ? styles.active : ''}`}>
                            <div className={styles.RoleTitle}><p>Статистика пользователей</p></div>
                                <div className={styles.ResultTestBody}>
                                    {analyticsLoading ? (
                                      <p>Loading analytics...</p>
                                    ) : (
                                      analytics.map((item) => (
                                        <Box key={item.id}>
                                          <div className={styles.Diagrams}>
                                          <Doughnut
                                              className={styles.Diagram}
                                              width={150}
                                              height={150}
                                              data={{
                                                datasets: [
                                                  {
                                                    data: [
                                                      item.correctAnswersCount,
                                                      item.incorrectAnswersCount,
                                                      item.unansweredQuestionsCount,
                                                    ],
                                                    backgroundColor: [
                                                      'rgba(75, 192, 192, 0.6)',
                                                      'rgba(255, 99, 132, 0.6)',
                                                      'rgba(54, 162, 235, 0.6)',
                                                    ],
                                                    borderColor: [
                                                      'rgba(75, 192, 192, 1)',
                                                      'rgba(255, 99, 132, 1)',
                                                      'rgba(54, 162, 235, 1)',
                                                    ],
                                                    borderWidth: 2,
                                                  },
                                                ],
                                                labels: ['Правильные', 'Неправильные', 'Неотвеченные'],
                                              }}
                                              options={chartOptions}
                                            />
                                            <div className={styles.InfoResult}>
                                              <p><strong>Тип:</strong> {item.type}</p>
                                              <p><strong>Имя пользователя:</strong> {item.userName}</p>
                                              <p><strong>Название теста:</strong> {item.testName}</p>
                                              <p><strong>Правильные ответы:</strong> {item.correctAnswersCount}</p>
                                              <p><strong>Неправильные ответы:</strong> {item.incorrectAnswersCount}</p>
                                              <p><strong>Неотвеченные:</strong> {item.unansweredQuestionsCount}</p>
                                              <p><strong>Дата:</strong> {formatDate(item.createdAt)}</p>
                                            </div>
                                          </div>
                                        </Box>
                                      ))
                                    )}
                                </div>
                            </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
