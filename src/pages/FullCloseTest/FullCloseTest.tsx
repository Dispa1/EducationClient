import React, { useState, useEffect } from 'react';
import styles from './FullCloseTest.module.scss';
import Box from '../../UI/Box/Box';
import Button from '../../UI/Button/Button';
import { ReactComponent as GoToMain } from '../../assets/icons/logout.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { getClosedQuestionTestById } from '../../store/service/CloseQuestionTest';

const FullCloseTest = () => {
    const navigate = useNavigate();
    const { testId } = useParams();
    const [testData, setTestData] = useState<any>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token && testId) {
            getClosedQuestionTestById(testId, token)
                .then(data => {
                    setTestData(data);
                })
                .catch(error => console.error('Error fetching test:', error));
        } else {
            console.error('Token or testId is undefined');
        }
    }, [testId]);

    const redirectToMainPage = () => {
        navigate('/');
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.BlockLeft}>
                <Box>
                    <div className={styles.GoBackToTheMainPage}>
                        <Button type="submit" variant="normal" onClick={redirectToMainPage}>
                            <div className={styles.GoToMain}>
                                <GoToMain title="" />
                            </div>
                            Основная страница
                        </Button>
                    </div>
                </Box>
            </div>
            <div className={styles.BlockCenter}>
                <div className={styles.FullCoursContent}>
                    <Box>
                        <div className={styles.Name}>
                            <h2>{testData ? testData.name : 'Loading...'}</h2>
                        </div>
                    </Box>
                    <div className={styles.content}>
                        <div className={styles.TestBody}>
                            {testData && testData.test.map((question: any, index: number) => (
                                <Box key={index}>
                                    <div className={styles.questionText}>
                                        {question.questionText}
                                    </div>
                                    <div className={styles.options}>
                                        {question.options.map((option: any, optionIndex: number) => (
                                            <div key={optionIndex} className={styles.option}>
                                                {option.text}
                                            </div>
                                        ))}
                                    </div>
                                </Box>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.BlockRight}></div>
        </div>
    );
};

export default FullCloseTest;
