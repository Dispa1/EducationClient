import React, { useState, useEffect } from 'react';
import styles from './FullCloseTest.module.scss';
import Box from '../../UI/Box/Box';
import Button from '../../UI/Button/Button';
import { ReactComponent as Check } from '../../assets/icons/check.svg';
import { ReactComponent as GoToMain } from '../../assets/icons/logout.svg';
import { useParams, useNavigate } from 'react-router-dom';
import { getClosedQuestionTestById, checkAnswers } from '../../store/service/CloseQuestionTest';
import Modal from '../../UI/Modal/Modal';

interface Answer {
    questionId: number;
    optionId: number;
}

const FullCloseTest = () => {
    const navigate = useNavigate();
    const { testId } = useParams();
    const [testData, setTestData] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<(Answer | null)[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [testResults, setTestResults] = useState<any>(null);
    const [timerRunning, setTimerRunning] = useState<boolean>(true);
    const [testFinished, setTestFinished] = useState<boolean>(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
        const userId = userData.userId;
        const userName = userData.full_name || ''; // Retrieve userName from userData

        if (token && testId) {
            getClosedQuestionTestById(testId, token)
                .then(data => {
                    setTestData(data);
                    setTimeLeft(data.time * 60);
                    setUserAnswers(new Array(data.test.length).fill(null));
                })
                .catch(error => console.error('Error fetching test:', error));
        } else {
            console.error('Token or testId is undefined');
        }
    }, [testId]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTimeLeft => {
                if (prevTimeLeft === 0 || !timerRunning) { 
                    clearInterval(timer);
                    setTimerRunning(false);
                    if (!testFinished) {
                        finishTest();
                    }
                }
                return prevTimeLeft - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timerRunning, testFinished]);

    useEffect(() => {
        const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
    
            const currentTarget = event.currentTarget as Window;
            if (currentTarget && 'location' in currentTarget && currentTarget.location) {
                if (currentTarget.location.href !== window.location.href) {
                    if (!testFinished) {
                        await checkTestResults();
                        setTestFinished(true);
                    }
                }
            }
            navigate('/');
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [navigate, testFinished]);    

    const redirectToMainPage = () => {
        navigate('/');
    };

    const handleOptionClick = (questionIndex: number, optionId: number) => {
        if (testData && testData.test && testData.test[questionIndex]) {
            setUserAnswers(prevAnswers => {
                const newAnswers = [...prevAnswers];
                newAnswers[questionIndex] = {
                    questionId: testData.test[questionIndex].id,
                    optionId: optionId
                };
                return newAnswers;
            });
        }
    };

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    const finishTest = async () => {
        await checkTestResults();
        setModalOpen(true);
    };

    const checkTestResults = async () => {
        const token = sessionStorage.getItem('token');
        const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
        const userId = userData.userId;
        const userName = userData.full_name || ''; // Retrieve userName from userData
    
        if (token && userId && testId && testData) {
            try {
                const answers: Answer[] = [];
                userAnswers.forEach((answer, index) => {
                    if (answer) {
                        answers.push({ questionId: testData.test[index].id, optionId: answer.optionId });
                    }
                });
    
                const testName = testData.name;

                console.log('Sending data to server:', { testId, userId, userName, testName, answers });
    
                const results = await checkAnswers(testId, userId, userName, testName, answers, token);
                console.log('Results:', results);
    
                setTestResults(results);
            } catch (error) {
                console.error('Error checking answers:', error);
            }
        } else {
            console.error('Token, userId, testId, or testData is undefined');
        }
    };    

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.BlockLeft}>
            </div>

            <div className={styles.BlockCenter}>
                <div className={styles.FullCoursContent}>
                    <Box>
                        <div className={styles.Name}>
                            <h1>{testData ? testData.name : 'Loading...'}</h1>
                        </div>
                    </Box>
                    <div className={styles.content}>
                        <div className={styles.TestBody}>
                            {testData && testData.test.map((question: any, questionIndex: number) => (
                                <Box key={questionIndex}>
                                    <div className={styles.questionText}>
                                        <h2>{question.questionText}</h2>
                                    </div>
                                    <div className={styles.options}>
                                        {question.options.map((option: any, optionIndex: number) => (
                                            <div
                                                key={optionIndex}
                                                className={`${styles.option} ${userAnswers[questionIndex]?.optionId === option.id ? styles.active : ''}`}
                                                onClick={() => handleOptionClick(questionIndex, option.id)}
                                            >
                                                <div className={styles.answer}>
                                                    {option.text}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Box>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.BlockRight}>
                <div>
                    <Box>
                        <div className={styles.finishBlock}>
                            <Button variant='success' onClick={finishTest}>Закончить тестирование<Check/></Button>
                        </div>
                    </Box>
                </div>
                <div className={styles.blockTime}>
                    <Box>
                        <div className={styles.timer}>{formatTime(timeLeft)}</div>
                    </Box>
                </div>
            </div>

            <Modal isOpen={modalOpen} onClose={closeModal}>
                <div className={styles.headerModal}>
                    <h2>Результаты тестирования</h2>
                </div>
                <div className={styles.bodyModal}>
                    {testResults && (
                        <div className={styles.testResult}>
                            <p>Количество правильных ответов: {testResults.correctCount}</p>
                            <p>Количество неправильных ответов: {testResults.incorrectCount}</p>
                        </div>
                    )}
                </div>
                <div className={styles.footerModal}>
                    <div className={styles.ButtonsBlock}>
                        <Button variant='success' onClick={redirectToMainPage}>Вернуться на главную</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FullCloseTest;