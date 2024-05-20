import React, { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server'; // Импорт функции renderToString
import styles from './FullCours.module.scss';
import Box from '../../UI/Box/Box';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import { ReactComponent as GoToMain } from '../../assets/icons/logout.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourseById } from '../../store/service/Course';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const FullCours = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState<any>(null);
    const [subSections, setSubSections] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');

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

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    const highlightSearchResults = (text: string): React.ReactNode => {
        if (!searchTerm) return text;
    
        const regex = new RegExp(`(${searchTerm})`, 'gi');
    
        return (
            <React.Fragment>
                {text.split(regex).map((part, index) =>
                    regex.test(part) ? (
                        <kbd key={index} style={{ backgroundColor: 'rgba(173, 216, 230, 0.5)' }}>
                            {part}
                        </kbd>
                    ) : (
                        <React.Fragment key={index}>{part}</React.Fragment>
                    )
                )}
            </React.Fragment>
        );
    };
    

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    if (!courseData) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.BlockLeft}>
                <div>
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
            </div>
            <div className={styles.BlockCenter}>
                <div>
                    <Box>
                        <div className={styles.title}>
                            <h1>{courseData.title}</h1>
                        </div>
                    </Box>
                </div>
                <div className={styles.scrollMarginBlock}>
                    <div className={styles.scrollMargin}>
                        <Box>
                            <div className={styles.content}>
                                <div className={styles.scrollMargin}> 
                                    <div className={styles.SubSections}>
                                        <div className={styles.TabContent}>
                                            <div className={activeTab === 1 ? styles.ActiveTabContent : styles.HiddenTabContent}>
                                                <div className={styles.SubSectionsName}>
                                                    <h1>Описание курса</h1>
                                                </div>
                                                <div className={styles.fullCoursImageBody}>
                                                    <div className={styles.fullCoursImage}>
                                                        <img src={courseData.imageUrl} alt={courseData.title} />
                                                    </div>
                                                </div>
                                                <div className={styles.SubSectionsText}>
                                                    <ReactMarkdown className={styles.MarkDown} remarkPlugins={[gfm]}>
                                                        {renderToString(highlightSearchResults(courseData.description))}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                            {subSections.map((subsection: any, index: number) => (
                                                <div key={index} className={activeTab === index + 2 ? styles.ActiveTabContent : styles.HiddenTabContent}>
                                                    <div className={styles.SubSectionsName}>
                                                        <h1>{subsection.name}</h1>
                                                    </div>
                                                    <div className={styles.SubSectionsImage}>
                                                        <img src={subsection.image} alt="" />
                                                    </div>
                                                    <div className={styles.SubSectionsText}>
                                                        <ReactMarkdown className={styles.MarkDown} remarkPlugins={[gfm]}>
                                                            {renderToString(highlightSearchResults(subsection.text))}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                </div>
                <div>
                    <Box>
                        <div className={styles.TabButtons}>
                            <div onClick={() => handleTabClick(1)} className={activeTab === 1 ? styles.ActiveTabButton : styles.TabButton}>1</div>
                            {subSections.map((_, index: number) => (
                                <div key={index} onClick={() => handleTabClick(index + 2)} className={activeTab === index + 2 ? styles.ActiveTabButton : styles.TabButton}>{index+2}</div>     
                            ))}
                        </div>
                    </Box>
                </div>
            </div>
            <div className={styles.BlockRight}>
                {/* <Box>
                    <div className={styles.SearchBlock}>
                        <Input placeholder="Поиск" onChange={handleSearch} />
                    </div>
                </Box> */}
            </div>
        </div>
    );
};

export default FullCours;
