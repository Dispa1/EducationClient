import React, { useState, useEffect } from 'react';
import styles from './FullCours.module.scss'
import Box from '../../UI/Box/Box';
import Button from '../../UI/Button/Button';
import { ReactComponent as GoToMain } from '../../assets/icons/logout.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourseById } from '../../store/service/Course';

const FullCours = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState<any>(null);
    const [subSections, setSubSections] = useState<any[]>([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token && courseId) { 
            getCourseById(courseId, token)
                .then(data => {
                    setCourseData(data);
                    setSubSections(data.subSections);
                })
                .catch(error => console.error('Error fetching course:', error));
        } else {
            console.error('Token or courseId is undefined');
        }
    }, [courseId]);

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
                                <GoToMain title=""/>
                            </div>
                            Основная страница
                        </Button>
                    </div>
                </Box>
            </div>
            <div className={styles.BlockCenter}>
                <div className={styles.FullCoursContent}>
                    <Box>
                        <div className={styles.content}>
                            <div className={styles.scrollMargin}> 
                                <div className={styles.title}>
                                    <h2>{courseData ? courseData.title : 'Loading...'}</h2>
                                </div>
                                <div className={styles.ImageBody}>
                                    <img src={courseData ? courseData.image : ''} alt="" />
                                </div>
                                <div className={styles.textBlock}>
                                    {courseData ? courseData.description : 'Loading...'}
                                </div>
                                <div className={styles.SubSections}> 
                                    {subSections.map((subsection: any, index: number) => (
                                        <div key={index} className={styles.SubSection}>
                                            <div className={styles.SubSectionsName}>
                                                <h3>{subsection.name}</h3>
                                            </div>
                                            <div className={styles.SubSectionsImage}>
                                                <img src={subsection.image} alt="" />
                                            </div>
                                            <div className={styles.SubSectionsText}>
                                                <p>{subsection.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Box>
                </div>
            </div>
            <div className={styles.BlockRight}></div>
        </div>
    );
};

export default FullCours;
