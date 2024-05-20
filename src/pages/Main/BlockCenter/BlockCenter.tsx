import React, { useState, useEffect } from 'react';
import Box from '../../../UI/Box/Box';
import styles from './BlockCenter.module.scss';
import Container from '../../../UI/container/container';
import NewsImage from '../../../assets/images/News.jpg';
import Button from '../../../UI/Button/Button';
import { useNavigate } from 'react-router-dom';
import { getAllNewsFromServer } from '../../../store/service/News';
import { getAllCourses } from '../../../store/service/Course';
import { getAllOpenQuestionTest } from '../../../store/service/OpenQuestionTest';
import { getAllClosedQuestionsTest } from '../../../store/service/CloseQuestionTest';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Modal from '../../../UI/Modal/Modal';
import { ReactComponent as Close } from '../../../assets/icons/circle-xmark.svg';
import { ReactComponent as NoImage } from '../../../assets/icons/image-slash.svg';

interface Test {
    id: string;
    name: string;
    description: string;
    time: number;
    questions: any[];
}

interface Course {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    image: string;
}

const BlockCenter = () => {
    const [activeItem, setActiveItem] = useState<number>(0);
    const [activeItemTestHeader, setActiveItemTestHeader] = useState<number>(0);
    const [news, setNews] = useState<any[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [openTests, setOpenTests] = useState<any[]>([]);
    const [closedTests, setClosedTests] = useState<any[]>([]);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedTestId, setSelectedTestId] = useState<string>('');
    const [selectedTestName, setSelectedTestName] = useState<string>('');
    const [selectedTestTime, setSelectedTestTime] = useState<number>();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const userData = sessionStorage.getItem('userData');
        if (userData) {
            const { role } = JSON.parse(userData);
            setUserRole(role);
        }
    }, []);

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

    const handleStartOpenTest = (testId: string, testName: string, testTime: number) => {
        setSelectedTestTime(testTime);
        setSelectedTestName(testName);
        setSelectedTestId(testId);
        setIsModalOpen(true);
    };

    const handleStartCloseTest = (testId: string, testName: string, testTime: number) => {
        setSelectedTestTime(testTime);
        setSelectedTestName(testName);
        setSelectedTestId(testId);
        setIsModalOpen(true);
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

    const handleStartOpenTestPage = (testId: string) => {
        navigate(`/FullOpenTest/${testId}`);
    };
    
    const handleStartCloseTestPage = (testId: string) => {
        navigate(`/FullCloseTest/${testId}`);
    };
    

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
                            <div className={styles.AdminButton} >
                            {userRole === 'superuser' && (
                                    <Button type="submit" variant="normal" onClick={redirectToAdminPanel}>
                                        <h2>Админ Панель</h2>
                                    </Button>
                            )}
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
                                        {news.image ? (
                                            <img src={news.imageUrl} alt={news.title} />
                                        ) : (
                                            <NoImage className={styles.noImageIcon} />
                                        )}
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
                                        {cours.image ? (
                                            <img src={cours.imageUrl} alt={cours.title} />
                                        ) : (
                                            <NoImage className={styles.noImageIcon} />
                                        )}
                                        </div>
                                        <div className={styles.DescriptionBody}>
                                            <div className={styles.Name}>
                                                <h2>{cours.title}</h2>
                                            </div>
                                            <div className={styles.Description}>
                                            {/* {cours.description} */}
                                                <ReactMarkdown children={cours.description} remarkPlugins={[gfm]} skipHtml={true}></ReactMarkdown>
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
                                            <Button type="submit" variant="success" onClick={() => handleStartOpenTest(test.id, test.name, test.time)}>Начать тестирование</Button>
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
                                            <Button type="submit" variant="success" onClick={() => handleStartCloseTest(test.id, test.name, test.time)}>Начать тестирование</Button>
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
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className={styles.headerModal}>
                    <h2>{selectedTestName}</h2>
                    <div className={styles.closeIconBlock}>
                        <Close onClick={() => setIsModalOpen(false)} />
                    </div>
                </div>
                <div className={styles.bodyModal}>
                    <p>Перед началом тестирования, пожалуйста, обратите внимание на следующее:</p>
                    <ul>
                        <li>Убедитесь, что у вас достаточно времени и никаких внешних помех.</li>
                        <li style={{ whiteSpace: 'pre-wrap' }}>Тест имеет ограничение по времени в <b>{selectedTestTime} минут.</b> Он автоматически завершится по истечении этого времени.</li>
                        <li>Технические требования: убедитесь, что ваше интернет-соединение стабильно.</li>
                    </ul>
                </div>
                <div className={styles.footerModal}>
                    {selectedTestId && selectedTestName && selectedTestTime && (
                        <>
                            {activeItemTestHeader === 0 ? (
                                <Button variant="normal" onClick={() => handleStartOpenTestPage(selectedTestId)}>Начать тестирование</Button>
                            ) : (
                                <Button variant="normal" onClick={() => handleStartCloseTestPage(selectedTestId)}>Начать тестирование</Button>
                            )}
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default BlockCenter;
