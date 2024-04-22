import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '../../pages/Login/Login';
import MainPage from '../../pages/Main/Main';
import AdminPanelPage from '../../pages/AdminPanel/AdminPanel'
import FullCoursPage from '../../pages/FullCours/FullCours'
import FullOpenTestPage from '../../pages/FullOpenTest/FullOpenTest'
import FullCloseTestPage from '../../pages/FullCloseTest/FullCloseTest'

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/AdminPanel" element={<AdminPanelPage />} />
        <Route path="/FullCours/:courseId" element={<FullCoursPage />} />
        <Route path="/FullOpenTest/:testId" element={<FullOpenTestPage />} />
        <Route path="/FullCloseTest/:testId" element={<FullCloseTestPage />} />
      </Routes>
    </Router>
  );
};

export default App;
