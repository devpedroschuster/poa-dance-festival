import { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import API_URL from '../api';

const Container = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 60vh; color: white;
`;
const Input = styled.input`
  padding: 15px; margin-top: 15px; border-radius: 5px; border: 1px solid #333;
  background-color: #222; color: white; font-size: 1.1rem; width: 100%; max-width: 300px;
`;
const Button = styled.button`
  margin-top: 20px; padding: 15px 40px; background-color: #ff4081; color: white;
  border: none; border-radius: 50px; font-weight: bold; cursor: pointer; font-size: 1.1rem;
`;

export default function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ login: '', senha: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (data.sucesso) {
        localStorage.setItem('poadance_token', data.token);
        
        toast.success('Login realizado! 🔓');
        onLoginSuccess();
      } else {
        toast.error(data.mensagem || 'Dados incorretos');
      }
    } catch (err) {
      toast.error('Erro de conexão');
    }
  };

  return (
    <Container>
      <h2>Área Restrita 🔒</h2>
      <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
        <Input 
          type="text" placeholder="Usuário" 
          value={form.login} onChange={e => setForm({...form, login: e.target.value})} 
        />
        <Input 
          type="password" placeholder="Senha" 
          value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} 
        />
        <Button type="submit">Entrar</Button>
      </form>
    </Container>
  );
}