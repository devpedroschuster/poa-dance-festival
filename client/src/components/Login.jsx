import { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import API_URL from '../api';

const Container = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 60vh; color: white;
`;

const Title = styled.h2`
  color: #ff4081; margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 15px; margin-top: 20px; border-radius: 5px; border: 1px solid #333;
  background-color: #222; color: white; font-size: 1.2rem; text-align: center;
  width: 100%; max-width: 300px;
  
  &:focus { outline: none; border-color: #ff4081; }
`;

const Button = styled.button`
  margin-top: 20px; padding: 15px 40px; background-color: #ff4081; color: white;
  border: none; border-radius: 50px; font-weight: bold; cursor: pointer; font-size: 1.1rem;
  transition: 0.3s;
  
  &:hover { transform: scale(1.05); }
`;

export default function Login({ onLoginSuccess }) {
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha })
      });
      const data = await res.json();

      if (data.sucesso) {
        toast.success('Acesso Liberado! 😎');
        onLoginSuccess();
      } else {
        toast.error('Senha Incorreta 🔒');
      }
    } catch (err) {
      toast.error('Erro de conexão com o servidor.');
    }
  };

  return (
    <Container>
      <Title>Área Restrita 🔒</Title>
      <p>Digite a senha de administrador.</p>
      
      <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
        <Input 
          type="password" 
          placeholder="Senha" 
          value={senha} 
          onChange={e => setSenha(e.target.value)} 
        />
        <Button type="submit">Entrar</Button>
      </form>
    </Container>
  );
}