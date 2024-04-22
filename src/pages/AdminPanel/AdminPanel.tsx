import React, { useState } from 'react';
import styles from './AdminPanel.module.scss';
import Button from '../../UI/Button/Button';
import Box from '../../UI/Box/Box';
import { ReactComponent as GoToMain } from '../../assets/icons/logout.svg';
import { useNavigate } from 'react-router-dom';
import { createRole } from '../../store/service/Role';
import { registerUser } from '../../store/service/User';
import { createCourse } from '../../store/service/Course';
import { createOpenQuestionTest } from '../../store/service/OpenQuestionTest';
import { createClosedQuestionTest } from '../../store/service/CloseQuestionTest';

import axios from 'axios';

import { ReactComponent as Info } from '../../assets/icons/info.svg';
import { ReactComponent as RoleIcon } from '../../assets/icons/department.svg';
import { ReactComponent as UserIcon } from '../../assets/icons/users-alt.svg';
import { ReactComponent as Cours } from '../../assets/icons/diploma.svg';
import { ReactComponent as QuestionsOpen } from '../../assets/icons/question.svg';
import { ReactComponent as QuestionsClosed } from '../../assets/icons/question-square.svg';

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

const AdminPanel = () => {
    const [activeItem, setActiveItem] = useState<number>(0);
    const [roleName, setRoleName] = useState<string>('');
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [sectionInputs, setSectionInputs] = useState<Subsection[]>([{ name: '', image: '', text: '' }]);
    const [openQuestions, setOpenQuestions] = useState<OpenQuestion[]>([]);
    const [closedQuestions, setClosedQuestions] = useState<ClosedQuestion[]>([]);
    const [questionText, setQuestionText] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [time, setTime] = useState<number>(0);
    const [closedQuestionText, setClosedQuestionText] = useState('');
    const [closedOptions, setClosedOptions] = useState<ClosedQuestionOption[]>([{ text: '', isCorrect: false }]);
    const [options, setOptions] = useState<ClosedQuestionOption[]>([{ text: '', isCorrect: false }]);
    const [closedTestTime, setClosedTestTime] = useState<number>(0);
    const navigate = useNavigate();

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

    const handleCreateCourse = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует');
            }
            const courseData = {
                title,
                description,
                image,
                subSections: sectionInputs,
            };
            await createCourse(courseData, token);
            setTitle('');
            setDescription('');
            setImage('');
            setSectionInputs([{ name: '', image: '', text: '' }]);
            alert('Курс успешно создан!');
        } catch (error) {
            console.error('Ошибка при создании курса:', error);
            alert('Произошла ошибка при создании курса');
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
        // Проверяем, что текст вопроса не пустой
        if (questionText.trim() === '') {
            alert('Пожалуйста, заполните текст вопроса');
            return;
        }
    
        // Проверяем, что есть хотя бы один вариант ответа
        if (options.length === 0 || options.every(option => option.text.trim() === '')) {
            alert('Пожалуйста, добавьте хотя бы один вариант ответа');
            return;
        }
    
        // Проверяем, что хотя бы один вариант ответа отмечен как правильный
        if (!options.some(option => option.isCorrect)) {
            alert('Пожалуйста, отметьте хотя бы один вариант ответа как правильный');
            return;
        }
    
        // Создаем новый вопрос с введенными данными и добавляем его к списку вопросов
        const newQuestion: ClosedQuestion = {
            questionText: questionText,
            options: options,
        };
        setClosedQuestions([...closedQuestions, newQuestion]);
        
        // Сбрасываем значения для следующего вопроса
        setQuestionText('');
        setOptions([{ text: '', isCorrect: false }]);
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
                    <ul>
                        <li className={activeItem === 0 ? styles.active : ''} onClick={() => handleItemClick(0)}><Info/>Информация<div className={styles.line}></div></li>
                        <li className={activeItem === 1 ? styles.active : ''} onClick={() => handleItemClick(1)}><RoleIcon/>Роли<div className={styles.line}></div></li>
                        <li className={activeItem === 2 ? styles.active : ''} onClick={() => handleItemClick(2)}><UserIcon/>Пользователи<div className={styles.line}></div></li>
                        <li className={activeItem === 3 ? styles.active : ''} onClick={() => handleItemClick(3)}><Cours/>Курсы<div className={styles.line}></div></li>
                        <li className={activeItem === 4 ? styles.active : ''} onClick={() => handleItemClick(4)}><QuestionsOpen/>Открытые вопросы<div className={styles.line}></div></li>
                        <li className={activeItem === 5 ? styles.active : ''} onClick={() => handleItemClick(5)}><QuestionsClosed/>Закрытые вопросы<div className={styles.line}></div></li>
                    </ul>
                </Box>
            </div>
            <div className={styles.Tabs}>
                <ul>
                    {/* Добавлены формы для создания роли, пользователя, курса и теста с открытыми вопросами */}
                    <li className={`${styles.News} ${activeItem === 0 ? styles.active : ''}`}>Информация</li>
                    <li className={`${styles.News} ${activeItem === 1 ? styles.active : ''}`}>
                        Роли
                        <form onSubmit={(e) => { e.preventDefault(); handleCreateRole(); }}>
                            <input 
                                type="text" 
                                value={roleName} 
                                onChange={(e) => setRoleName(e.target.value)} 
                                placeholder="Введите название роли" 
                            />
                            <Button type="submit" variant="normal">Создать</Button>
                        </form>
                    </li>
                    <li className={`${styles.News} ${activeItem === 2 ? styles.active : ''}`}>
                        Пользователи
                        <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }}>
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                placeholder="Имя пользователя" 
                            />
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Пароль" 
                            />
                            <input 
                                type="text" 
                                value={fullName} 
                                onChange={(e) => setFullName(e.target.value)} 
                                placeholder="Полное имя" 
                            />
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Email" 
                            />
                            <Button type="submit" variant="normal">Создать пользователя</Button>
                        </form>
                    </li>
                    <li className={`${styles.News} ${activeItem === 3 ? styles.active : ''}`}>
                        Курсы
                        <form onSubmit={(e) => { e.preventDefault(); handleCreateCourse(); }}>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="Название курса" 
                            />
                            <input 
                                type="text" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                placeholder="Описание курса" 
                            />
                            <input 
                                type="text" 
                                value={image} 
                                onChange={(e) => setImage(e.target.value)} 
                                placeholder="URL изображения курса" 
                            />
                            {sectionInputs.map((section, index) => (
                                <div key={index}>
                                    <input 
                                        type="text" 
                                        value={section.name} 
                                        onChange={(e) => handleSectionChange(index, 'name', e.target.value)} 
                                        placeholder="Название раздела" 
                                    />
                                    <input 
                                        type="text" 
                                        value={section.image} 
                                        onChange={(e) => handleSectionChange(index, 'image', e.target.value)} 
                                        placeholder="URL изображения раздела" 
                                    />
                                    <input 
                                        type="text" 
                                        value={section.text} 
                                        onChange={(e) => handleSectionChange(index, 'text', e.target.value)} 
                                        placeholder="Текст раздела" 
                                    />
                                    <Button type="button" variant="normal" onClick={() => handleRemoveSection(index)}>Удалить раздел</Button>
                                </div>
                            ))}
                            <Button type="button" variant="normal" onClick={handleAddSection}>Добавить раздел</Button>
                            <Button type="submit" variant="normal">Создать курс</Button>
                        </form>
                    </li>
                    <li className={`${styles.News} ${activeItem === 4 ? styles.active : ''}`}>
                        Открытые вопросы
                        <form onSubmit={(e) => { e.preventDefault(); handleCreateOpenQuestionTest(); }}>
                            <input 
                                type="text" 
                                placeholder="Название теста" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                            <input 
                                type="text" 
                                placeholder="Описание теста" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                            <input 
                                type="number" 
                                placeholder="Время на тест (в минутах)" 
                                value={time} 
                                onChange={(e) => setTime(Number(e.target.value))} 
                            />
                            <h3>Открытые вопросы:</h3>
                            {openQuestions.map((question, index) => (
                                <div key={index}>
                                    <p><strong>Вопрос:</strong> {question.questionText}</p>
                                    <p><strong>Правильный ответ:</strong> {question.correctAnswer}</p>
                                    <Button type="button" variant="success" onClick={() => handleRemoveOpenQuestion(index)}>Удалить</Button>
                                </div>
                            ))}
                            <input 
                                type="text" 
                                placeholder="Текст вопроса" 
                                value={questionText} 
                                onChange={(e) => setQuestionText(e.target.value)} 
                            />
                            <input 
                                type="text" 
                                placeholder="Правильный ответ" 
                                value={correctAnswer} 
                                onChange={(e) => setCorrectAnswer(e.target.value)} 
                            />
                            <Button type="button" variant="success" onClick={handleAddOpenQuestion}>Добавить вопрос</Button>
                            <Button type="submit" variant="success">Создать тест</Button>
                        </form>
                    </li>
                    <li className={`${styles.News} ${activeItem === 5 ? styles.active : ''}`}> Закрытые вопросы
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateClosedQuestionTest(); }}>
                            <input 
                                type="text" 
                                placeholder="Название теста" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                            <input 
                                type="text" 
                                placeholder="Описание теста" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                             <input 
                                type="number" 
                                placeholder="Время на тест (в минутах)" 
                                value={closedTestTime} 
                                onChange={(e) => setClosedTestTime(Number(e.target.value))} 
                            />
                            <h3>Вопросы:</h3>
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
                            <input 
                                type="text" 
                                placeholder="Текст вопроса" 
                                value={questionText} 
                                onChange={(e) => setQuestionText(e.target.value)} 
                            />
                            <div>
                                {options.map((option, index) => (
                                    <div key={index}>
                                        <input 
                                            type="text" 
                                            placeholder={`Вариант ответа ${index + 1}`} 
                                            value={option.text} 
                                            onChange={(e) => handleOptionChange(index, 'text', e.target.value)} 
                                        />
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                checked={option.isCorrect} 
                                                onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)} 
                                            />
                                            Правильный ответ
                                        </label>
                                        <Button type="button" variant="danger" onClick={() => handleRemoveOption(index)}>Удалить</Button>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="normal" onClick={handleAddOption}>Добавить вариант ответа</Button>
                            <Button type="button" variant="normal" onClick={handleAddClosedQuestion}>Добавить вопрос</Button>
                            <Button type="submit" variant="normal">Создать тест</Button>
                        </form>
                        </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminPanel;
