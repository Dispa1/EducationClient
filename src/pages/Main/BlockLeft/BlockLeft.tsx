import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BlockLeft.module.scss';
import Box from '../../../UI/Box/Box';
import Container from '../../../UI/container/container';
import Image from '../../../assets/images/pngicon.png';
import Logo from '../../../assets/images/logo.jpg'
import { ReactComponent as Logout } from '../../../assets/icons/logout.svg';
import UserAnalyticsChart from './UserAnalytics/UserAnalytics';

const BlockLeft = () => {
    const navigate = useNavigate();
    const userDataString = sessionStorage.getItem('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null;

    const user = userData;

    const username = user?.username || 'ИМЯ';
    const fullname = user?.full_name || 'ФАМИЛИЯ';

    const daysInMonth = 30;

    const handleLogout = () => {
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <div className={styles.BlockLeft}>
            <Container>
                <Box>
                    <div className={styles.LogoConteaner}>
                        <div className={styles.MFGMastermind}>
                            <h2>MFG Mastermind</h2>
                        </div>
                        <div className={styles.AltynShyghys}>
                            <img src={Logo} alt="" />
                        </div>
                    </div>
                </Box>
                <Box>
                    <div className={styles.imageBody}>
                        <div className={styles.image}>
                            <img src={Image} />
                        </div>
                        <div className={styles.nickName}>
                            <h2>{username}</h2>
                            <h3>{fullname}</h3>
                        </div>
                        <div className={styles.logout}>
                            <Logout title="" onClick={handleLogout} />
                        </div>
                    </div>
                </Box>
                <Box>
                    <div className={styles.UserAnalytics}>
                        <h2>Ваша активность</h2>
                        <UserAnalyticsChart daysInMonth={daysInMonth} />
                    </div>
                </Box>
            </Container>
        </div>
    );
};

export default BlockLeft;