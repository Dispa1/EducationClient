import React, { useState, useEffect } from 'react';
import Box from '../../../UI/Box/Box';
import styles from './BlockCenter.module.scss';
import Container from '../../../UI/container/container';
import NewsImage from '../../../assets/images/News.jpg';
import CoursImage from '../../../assets/images/IT.jpg';
import Button from '../../../UI/Button/Button';
import { useNavigate } from 'react-router-dom';
import { getAllNewsFromServer } from '../../../store/service/News';
import { getAllCourses } from '../../../store/service/Course';
import { getAllOpenQuestionTest } from '../../../store/service/OpenQuestionTest';
import { getAllClosedQuestionsTest } from '../../../store/service/CloseQuestionTest';

interface Test {
    id: string;
    name: string;
    description: string;
    time: number;
    questions: any[];
}

const BlockCenter = () => {
    const [activeItem, setActiveItem] = useState<number>(0);
    const [activeItemTestHeader, setActiveItemTestHeader] = useState<number>(0);
    const [news, setNews] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [openTests, setOpenTests] = useState<any[]>([]);
    const [closedTests, setClosedTests] = useState<any[]>([]);
    const navigate = useNavigate();

    const redirectToAdminPanel = () => {
        navigate('/AdminPanel');
    };

    const handleItemClick = (index: number) => {
        setActiveItem(index);
    };

    const handleItemClickTestHeader = (index: number) => {
        setActiveItemTestHeader(index);
    };

    const handleCourseClick = (courseId: string) => {
        navigate(`/FullCours/${courseId}`);
    };       

    const handleStartOpenTest = (testId: string) => {
        navigate(`/FullOpenTest/${testId}`);
    };

    const handleStartCloseTest = (testId: string) => {
        navigate(`/FullCloseTest/${testId}`);
    };
    
    const handleSearch = (searchTerm: string) => {
        console.log('Searching for:', searchTerm);
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        getAllNewsFromServer(token)
            .then(data => setNews(data))
            .catch(error => console.error('Error fetching news:', error));

        getAllCourses(token)
            .then(data => setCourses(data))
            .catch(error => console.error('Error fetching courses:', error));

        getAllOpenQuestionTest(token)
            .then(openTestsData => {
                setOpenTests(openTestsData);
            })
            .catch(error => console.error('Error fetching open tests:', error));
    
        getAllClosedQuestionsTest(token)
            .then(closedTestsData => {
                setClosedTests(closedTestsData);
            })
            .catch(error => console.error('Error fetching closed tests:', error));
    }, []);

    return (
        <div className={styles.BlockCenter}>
            <Container>
                <div className={styles.header}>
                    <Box>
                        <div className={styles.HeaderRow}>
                            <ul className={styles.headerList}>
                                <li className={activeItem === 0 ? styles.active : ''} onClick={() => handleItemClick(0)}>
                                    <h2>Новости</h2>
                                    <div className={styles.line}></div>
                                </li>
                                <li className={activeItem === 1 ? styles.active : ''} onClick={() => handleItemClick(1)}>
                                    <h2>Курсы</h2>
                                    <div className={styles.line}></div>
                                </li>
                                <li className={activeItem === 2 ? styles.active : ''} onClick={() => handleItemClick(2)}>
                                    <h2>Тесты</h2>
                                    <div className={styles.line}></div>
                                </li>
                            </ul>
                            <div className={styles.AdminButton} onClick={redirectToAdminPanel}>
                                <Button type="submit" variant="normal">
                                    <h2>Админ Панель</h2>
                                </Button>
                            </div>
                        </div>
                    </Box>
                </div>
                <li className={`${styles.Test} ${activeItem === 2 ? styles.active : ''}`}>
                        <Box>
                        <div className={styles.testHeader}>
                            <div className={`${styles.headerTabs} ${activeItemTestHeader === 0 ? styles.active : ''}`} onClick={() => handleItemClickTestHeader(0)}>
                                <h2>Тесты с открытыми вопросами</h2>
                                <div className={styles.line}></div>
                            </div>
                            <div className={`${styles.headerTabs} ${activeItemTestHeader === 1 ? styles.active : ''}`} onClick={() => handleItemClickTestHeader(1)}>
                                <h2>Тесты с закрытыми вопросами</h2>
                                <div className={styles.line}></div>
                            </div>
                        </div>
                            </Box>
                            </li>
                <div className={styles.body}>
                    <ul>
                        <li className={`${styles.News} ${activeItem === 0 ? styles.active : ''}`}>
                            {news.map((news: any, index: number) => (
                                <Box key={index}>
                                    <div className={styles.Content}>
                                        <div className={styles.ImageBody}>
                                            <img src={NewsImage} alt="" />
                                        </div>
                                        <div className={styles.DescriptionBody}>
                                            <div className={styles.Name}>
                                                <h2>{news.name}</h2>
                                            </div>
                                            <div className={styles.Description}>
                                                <p>{news.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.Time}>
                                    {new Date(news.createdAt).toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    </div>
                                </Box>
                            ))}
                        </li>
                        <li className={`${styles.Cours} ${activeItem === 1 ? styles.active : ''}`}>
                            {courses.map((cours: any, index: number) => (
                                <Box key={index} >
                                    <div className={styles.Content} onClick={() => handleCourseClick(cours.id)}>
                                        <div className={styles.ImageBody}>
                                            <img src={CoursImage} alt="" />
                                        </div>
                                        <div className={styles.DescriptionBody}>
                                            <div className={styles.Name}>
                                                <h2>{cours.title}</h2>
                                            </div>
                                            <div className={styles.Description}>
                                                {cours.description}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.Time}>
                                    {new Date(cours.createdAt).toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    </div>
                                </Box>
                            ))}
                        </li>
                        <li className={`${styles.Test} ${activeItem === 2 ? styles.active : ''}`}>
                            <div className={`${styles.TestTab} ${activeItemTestHeader === 0 ? styles.active : ''}`}>
                            {openTests.map((test: any, index: number) => (
                                    <Box key={index}>
                                         <div className={styles.TestContent}>
                                        <div className={styles.Name}>
                                            <h2>{test.name}</h2>
                                        </div>
                                        <div className={styles.Description}>
                                            {test.description}
                                        </div>
                                        <div className={styles.TestCriteria}>
                                            <h3>Время {test.time} мин</h3>
                                            <h3>Вопросы {test.test.length}</h3>
                                            <Button type="submit" variant="success" onClick={() => handleStartOpenTest(test.id)}>Начать тест</Button>
                                        </div>
                                    </div>
                                    <div className={styles.Time}>
                                    {new Date(test.createdAt).toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    </div>
                                    </Box>
                                ))}
                            </div>
                            <div className={`${styles.TestTab} ${activeItemTestHeader === 1 ? styles.active : ''}`}>
                            {closedTests.map((test: any, index: number) => (
                                    <Box key={index}>
                                        <div className={styles.TestContent}>
                                        <div className={styles.Name}>
                                            <h2>{test.name}</h2>
                                        </div>
                                        <div className={styles.Description}>
                                            {test.description}
                                        </div>
                                        <div className={styles.TestCriteria}>
                                            <h3>Время {test.time} мин</h3>
                                            <h3>Вопросы {test.test.length}</h3>
                                            <Button type="submit" variant="success" onClick={() => handleStartCloseTest(test.id)}>Начать тест</Button>
                                        </div>
                                    </div>
                                    <div className={styles.Time}>
                                    {new Date(test.createdAt).toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    </div>
                                    </Box>
                                ))}
                            </div>
                        </li>
                    </ul>
                </div>
            </Container>
        </div>
    );
};

export default BlockCenter;
