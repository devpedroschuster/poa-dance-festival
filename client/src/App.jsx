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
  // Estado para controlar se a senha do admin foi digitada corretamente
  // (Esse estado reseta se a pessoa atualizar a página, o que é bom para segurança)
  const [isAdminLogado, setIsAdminLogado] = useState(false);

  return (
    // O BrowserRouter habilita a navegação por URLs
    <BrowserRouter>
      <MainContent>
        <ToastContainer position="top-center" autoClose={3000} theme="dark" />
        
        <Routes>
          {/* ROTA 1: A Página Principal ("/") */}
          <Route path="/" element={
            <>
              <Header />
              <Hero />
              <Schedule />
              <ChoreographySection />
            </>
          } />

          {/* ROTA 2: A Página de Admin ("/admin") */}
          <Route path="/admin" element={
            // Lógica de Proteção:
            isAdminLogado ? (
              <AdminPanel /> // Se logou, mostra o painel
            ) : (
              <Login onLoginSuccess={() => setIsAdminLogado(true)} /> // Senão, mostra login
            )
          } />

          {/* ROTA CORINGA: Se digitar qualquer outra coisa, joga para a Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </MainContent>
    </BrowserRouter>
  );
}

export default App;