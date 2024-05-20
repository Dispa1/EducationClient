import React, { useState } from 'react';
import { loginUser } from '../../store/slices/user';
import { Navigate } from 'react-router-dom';
import styles from './Login.module.scss';

import Box from '../../UI/Box/Box';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);   
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const accessToken = await loginUser({ username, password });
      setLoggedIn(true);
    } catch (error) {
      setError('Ошибка при авторизации');
    }
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.wrapper}>
      <div>
      <Box>
        <div className={styles.container}>
          <h1>Авторизация</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleLogin}>
            <Input
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="success">Войти</Button>
          </form>
        </div>
      </Box>
      </div>
    </div>
  );
};

export default Login;
