import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LoginPage from '../../pages/Login/Login';
import MainPage from '../../pages/Main/Main';
import AdminPanelPage from '../../pages/AdminPanel/AdminPanel';
import FullCoursPage from '../../pages/FullCours/FullCours';
import FullOpenTestPage from '../../pages/FullOpenTest/FullOpenTest';
import FullCloseTestPage from '../../pages/FullCloseTest/FullCloseTest';
import FullAnswerPage from '../../pages/FullAnswer/FullAnswerPage';

// Защищенный маршрут
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  if (!token) {
    sessionStorage.clear();
    navigate('/login');
    return null;
  }

  return element;
};

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthorization = () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        sessionStorage.clear();
        navigate('/login');
      }
    };

    checkAuthorization();
  }, [navigate]);

  useEffect(() => {
    const handleFetchError = (event: Event) => {
      const customEvent = event as CustomEvent<{ status: number }>;
      if (customEvent.detail.status === 403) {
        sessionStorage.clear();
        navigate('/login');
      }
    };

    window.addEventListener('fetchError', handleFetchError as EventListener);
    return () => {
      window.removeEventListener('fetchError', handleFetchError as EventListener);
    };
  }, [navigate]);

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const response = await originalFetch(input, init);
        if (response.status === 403) {
          const event = new CustomEvent('fetchError', { detail: { status: 403 } });
          window.dispatchEvent(event);
        }
        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute element={<MainPage />} />} />
      <Route path="/AdminPanel" element={<ProtectedRoute element={<AdminPanelPage />} />} />
      <Route path="/FullCours/:courseId" element={<ProtectedRoute element={<FullCoursPage />} />} />
      <Route path="/FullOpenTest/:testId" element={<ProtectedRoute element={<FullOpenTestPage />} />} />
      <Route path="/FullCloseTest/:testId" element={<ProtectedRoute element={<FullCloseTestPage />} />} />
      <Route path="/FullAnswer/:id" element={<ProtectedRoute element={<FullAnswerPage />} />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
