import React, { useState, useEffect } from 'react';
import styles from './FullAnswer.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '../../UI/Box/Box';
import Button from '../../UI/Button/Button';
import { ReactComponent as GoToMain } from '../../assets/icons/logout.svg';
import { getUserTestResultsForTest } from '../../store/service/OpenQuestionTest';
import { createAnalytics } from '../../store/service/Analytics';

import { ReactComponent as Check } from '../../assets/icons/check.svg';

interface Answer {
    questionId: number;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
}

interface TestResult {
    id: string;
    full_name: string;
    testName: string;
    answers: Answer[];
}

const FullAnswerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [testResult, setTestResult] = useState<TestResult | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<(boolean | null)[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    throw new Error('Токен отсутствует');
                }

                const userTestResult = await getUserTestResultsForTest(id!, token);
                setTestResult(userTestResult);

                const initialSelectedAnswers = userTestResult.answers.map(() => null);
                setSelectedAnswers(initialSelectedAnswers);
            } catch (error) {
                console.error('Ошибка при получении результатов теста:', error);
                alert('Произошла ошибка при получении результатов теста');
            }
        };

        fetchData();
    }, [id]);

    const redirectToMainPage = () => {
        navigate('/AdminPanel');
    };

    const handleOptionClick = (questionIndex: number, option: boolean) => {
        setSelectedAnswers(prevState => {
            const newState = [...prevState];
            newState[questionIndex] = option;
            return newState;
        });
    };

    const createAnalyticsRecord = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }

            const userDataStr = sessionStorage.getItem('userData');
            if (!userDataStr) {
                throw new Error('Данные пользователя отсутствуют в сессионном хранилище');
            }
            const userData = JSON.parse(userDataStr);
            const { userId, full_name } = userData;

            if (!testResult || !testResult.answers) {
                throw new Error('Данные для создания аналитики не загружены');
            }

            let correctAnswersCount = 0;
            let incorrectAnswersCount = 0;
            testResult.answers.forEach((answer, index) => {
                const selectedAnswer = selectedAnswers[index];
                if (selectedAnswer === true) {
                    correctAnswersCount++;
                } else if (selectedAnswer === false) {
                    incorrectAnswersCount++;
                }
            });

            const analyticsData = {
                type: 'Тест с открытыми вопросами',
                userId,
                userName: full_name,
                testId: id!,
                testName: testResult.testName,
                correctAnswersCount,
                incorrectAnswersCount,
            };

            console.log('Данные для аналитики:', analyticsData);

            await createAnalytics(analyticsData);

            console.log('Запись аналитики успешно создана');
            redirectToMainPage();
        } catch (error: any) {
            console.error('Ошибка при создании записи аналитики:', error.message);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.BlockLeft}>
                <div>
                    <Box>
                        <div className={styles.GoBackToTheMainPage}>
                            <Button type="submit" variant="normal" onClick={redirectToMainPage}>
                                <div className={styles.GoToMain}>
                                    <GoToMain title="" />
                                </div>
                                Вернуться в админпанель
                            </Button>
                        </div>
                    </Box>
                </div>
            </div>
            <div className={styles.BlockCenter}>
                {testResult && (
                    <div className={styles.RoleTitle}><p>Результаты теста: {testResult.testName} </p></div>
                )}
                {testResult && (
                    <div className={styles.UnswersBody}>
                        <Box>
                            <div className={styles.HeaderText}>Пользователь: {testResult.full_name}</div>
                        </Box>
                        <ul className={styles.Unswers}>
                            {testResult.answers.map((answer, answerIndex) => (
                                <div className={styles.Box} key={answerIndex}>
                                    <li>
                                        <div className={styles.UnswerTitle}>
                                            Вопрос №{answerIndex + 1}:
                                        </div>
                                        <div className={styles.UnswerText}> {answer.questionText}</div>
                                        <div className={styles.UnswerTitle}>
                                            Правильный ответ:
                                        </div>
                                        <div className={styles.UnswerText}>
                                            {answer.correctAnswer}
                                        </div>
                                        <div className={styles.UnswerTitle}>
                                            Ответ пользователя:
                                        </div>
                                        <div className={styles.UnswerText}> {answer.userAnswer}</div>
                                    </li>
                                    <div className={styles.CheckBoxBody}>
                                        <div className={`${styles.CheckBoxTrue} ${selectedAnswers[answerIndex] === true ? styles.active : ''}`}
                                            onClick={() => handleOptionClick(answerIndex, true)}
                                        >
                                            <p>Правильный ответ</p>
                                        </div>
                                        <div className={`${styles.CheckBoxFalse} ${selectedAnswers[answerIndex] === false ? styles.active : ''}`}
                                            onClick={() => handleOptionClick(answerIndex, false)}
                                        >
                                            <p>Неправильный ответ</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className={styles.BlockRight}>
                <div>
                    <Box>
                    <div className={styles.finishBlock}>
                        <Button type="submit" variant="success" onClick={createAnalyticsRecord}>
                            Записать результаты пользователя
                            <Check />
                        </Button>
                    </div>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default FullAnswerPage;
