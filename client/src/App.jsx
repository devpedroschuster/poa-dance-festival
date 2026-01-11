import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Hero from './components/Hero';
import Schedule from './components/Schedule';
import ChoreographySection from './components/ChoreographySection';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

const MainContent = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0; padding: 0; box-sizing: border-box;
`;

function App() {
  const [isAdminLogado, setIsAdminLogado] = useState(false);

  return (
    <BrowserRouter>
      <MainContent>
        <ToastContainer position="top-center" autoClose={3000} theme="dark" />
        
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Hero />
              <Schedule />
              <ChoreographySection />
            </>
          } />

          <Route path="/admin" element={
            isAdminLogado ? (
              <AdminPanel />
            ) : (
              <Login onLoginSuccess={() => setIsAdminLogado(true)} />
            )
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </MainContent>
    </BrowserRouter>
  );
}

export default App;