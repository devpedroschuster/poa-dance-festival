import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaInstagram, FaEnvelope } from 'react-icons/fa';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

// PROGRAMAÇÃO
const cronograma = {
  "01/05": [
    { hora: '09:00', estilo: 'Credenciamento', nivel: 'Geral', professor: 'Equipe' },
    { hora: '10:00', estilo: 'Jazz Funk', nivel: 'Iniciante', professor: 'Ana Silva' },
    { hora: '11:30', estilo: 'Hip Hop Dance', nivel: 'Open', professor: 'Carlos D.' },
    { hora: '14:00', estilo: 'K-Pop', nivel: 'Geral', professor: 'Grupo X' },
    { hora: '16:00', estilo: 'Stiletto', nivel: 'Intermediário', professor: 'Júlia B.' },
    { hora: '18:00', estilo: 'Vogue', nivel: 'Avançado', professor: 'House of Z' },
  ],
  "02/05": [
    { hora: '09:00', estilo: 'Ballet Clássico', nivel: 'Intermediário', professor: 'Marta R.' },
    { hora: '10:30', estilo: 'Contemporâneo', nivel: 'Chão/Fluxo', professor: 'Pedro S.' },
    { hora: '14:00', estilo: 'Urban Mix', nivel: 'Geral', professor: 'Tiago L.' },
    { hora: '16:00', estilo: 'Dancehall', nivel: 'Open', professor: 'Vivi A.' },
    { hora: '18:00', estilo: 'Batalha All Style', nivel: 'Competição', professor: 'MC John' },
  ],
  "03/05": [
    { hora: '10:00', estilo: 'Jazz Musical', nivel: 'Broadway', professor: 'Lucas M.' },
    { hora: '13:00', estilo: 'Waacking', nivel: 'Open', professor: 'Sofia K.' },
    { hora: '15:00', estilo: 'Heels Class', nivel: 'Avançado', professor: 'Beatriz F.' },
    { hora: '17:00', estilo: 'Encerramento', nivel: 'Geral', professor: 'Todos' },
  ]
};

// ANIMAÇÕES
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; }`;

// ESTILOS
const Navbar = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 2rem;
  position: relative;
  z-index: 10;
  
  h1 {
    font-size: 1.8rem;
    color: white;
    margin: 0;
    text-align: center;
    span { color: #ff4081; }
  }
`;

const HeroContainer = styled.header`
  position: relative; height: 70vh; min-height: 500px;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  text-align: center; overflow: hidden; margin-top: -85px; padding-top: 85px;
`;
const VideoBg = styled.video`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;
`;
const VideoOverlay = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(44, 14, 56, 0.7); z-index: 1;
`;
const HeroContent = styled.div`
  position: relative; z-index: 2; padding: 2rem; animation: ${slideUp} 0.8s ease-out;
  h2 { font-size: 3.5rem; margin: 0; line-height: 1; text-shadow: 0 4px 25px rgba(0,0,0,0.8); }
  p.date { font-size: 1.3rem; color: #ffcdd2; margin-top: 15px; font-weight: 700; letter-spacing: 3px; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
  p.subtitle { margin-top: 1rem; font-size: 1.1rem; opacity: 0.9; letter-spacing: 1px; }
  @media (max-width: 768px) { h2 { font-size: 2.5rem; } p.date { font-size: 1.1rem; } }
`;

const MainContent = styled.div`
  max-width: 1100px; margin: 0 auto; padding: 4rem 2rem;
  display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px;
  align-items: start; position: relative; z-index: 5;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const ScheduleContainer = styled.div`animation: ${fadeIn} 1s;`;
const Tabs = styled.div`display: flex; gap: 10px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 5px;`;
const TabButton = styled.button`
  background: ${props => props.$active ? '#ff4081' : 'rgba(255,255,255,0.1)'};
  color: white; border: 1px solid ${props => props.$active ? '#ff4081' : 'rgba(255,255,255,0.2)'};
  padding: 10px 20px; border-radius: 30px; cursor: pointer; white-space: nowrap; transition: all 0.3s;
  &:hover { background: #ff4081; border-color: #ff4081; transform: translateY(-2px); }
`;
const ClassList = styled.div`
  max-height: 600px; overflow-y: auto; padding-right: 10px;
  &::-webkit-scrollbar { width: 6px; } &::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 3px; } &::-webkit-scrollbar-thumb { background: #ff4081; border-radius: 3px; }
`;
const ClassCard = styled.div`
  background: rgba(18, 18, 18, 0.8); border: 1px solid rgba(255, 64, 129, 0.3);
  padding: 20px; margin-bottom: 15px; border-radius: 12px;
  display: flex; justify-content: space-between; align-items: center;
  transition: all 0.3s ease; position: relative; overflow: hidden;
  &:hover { transform: translateX(5px); border-color: #ff4081; box-shadow: 0 0 15px rgba(255, 64, 129, 0.2); background: #1a1a1a; }
  &::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(to bottom, #ff4081, #6200ea); }
  .time { font-size: 1.2rem; font-weight: 800; color: #ffcdd2; min-width: 70px; }
  .info { flex: 1; padding: 0 15px; }
  h4 { margin: 0; font-size: 1.1rem; color: white; text-transform: uppercase; }
  p { margin: 5px 0 0; font-size: 0.85rem; color: #ccc; }
  .badge { font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; margin-left: 5px; color: #ff4081; border: 1px solid #ff4081; }
`;

const FormCard = styled.div`
  background: white; color: #333; padding: 2rem; border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5); position: sticky; top: 20px;
  h3 { margin-top: 0; color: #880e4f; font-size: 1.5rem; }
  p { color: #666; font-size: 0.9rem; margin-bottom: 20px; line-height: 1.4; }
`;
const Input = styled.input`
  width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;
  &:focus { border-color: #880e4f; outline: none; box-shadow: 0 0 0 3px rgba(136, 14, 79, 0.1); }
`;
const Select = styled(Input).attrs({ as: 'select' })``;
const Button = styled.button`
  width: 100%; padding: 15px; background: #880e4f; color: white; border: none; border-radius: 6px; font-size: 1.1rem; cursor: pointer;
  transition: background 0.3s; margin-top: 10px;
  &:hover { background: #c2185b; } &:disabled { background: #ccc; cursor: not-allowed; }
`;

// ESTILOS DE CONTATO
const ContactSection = styled.div`
  text-align: center; padding: 3rem 1rem 1rem; z-index: 5; position: relative;
  h3 { color: white; font-size: 1.5rem; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 2px; }
`;
const IconContainer = styled.div`
  display: flex; justify-content: center; gap: 25px; margin-bottom: 2rem;
`;
const SocialLink = styled.a`
  color: white; font-size: 2.2rem; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  &:hover { color: #ff4081; transform: translateY(-5px) scale(1.1); }
`;

const Footer = styled.footer`
  text-align: center; padding: 1rem; z-index: 5; position: relative;
  p { margin: 5px 0; font-size: 0.8rem; opacity: 0.6; }
  strong { color: #ffcdd2; opacity: 1; }
`;

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [inscricao, setInscricao] = useState({ nome: '', email: '', aula: '' });
  const [loading, setLoading] = useState(false);
  const [diaAtivo, setDiaAtivo] = useState("01/05");
  
  const [isAdminLogado, setIsAdminLogado] = useState(() => !!localStorage.getItem('poadance_token'));
  const handleLogout = () => { localStorage.removeItem('poadance_token'); setIsAdminLogado(false); };

  const enviarInscricao = async (e) => {
    e.preventDefault();
    if (!inscricao.aula) return toast.warn("Selecione uma aula!");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/inscrever`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inscricao)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Inscrição realizada! Verifique seu e-mail.');
        setInscricao({ nome: '', email: '', aula: '' });
      } else { toast.error(data.erro || 'Erro ao realizar inscrição.'); }
    } catch (error) { toast.error('Erro de conexão.'); }
    setLoading(false);
  };

  return (
    <BrowserRouter>
      <Navbar>
        <h1>POA <span>DANCE</span> FESTIVAL</h1>
      </Navbar>
      
      <ToastContainer position="bottom-right" theme="colored" />

      <Routes>
        <Route path="/" element={
          <>
            <HeroContainer>
              <VideoBg autoPlay loop muted playsInline>
                <source src="/festival-promo.mp4" type="video/mp4" />
              </VideoBg>
              <VideoOverlay />
              <HeroContent>
                <p className="subtitle">PORTO ALEGRE APRESENTA</p>
                <h2>O SEU NOVO FESTIVAL</h2>
                <p className="date">01, 02 E 03 DE MAIO 2026</p>
              </HeroContent>
            </HeroContainer>

            <MainContent>
              <ScheduleContainer>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                  <h3 style={{margin:0, borderBottom:'2px solid #ff4081', display:'inline-block', paddingBottom:'5px'}}>Programação</h3>
                  <span style={{fontSize:'0.8rem', opacity:0.7}}>*Sujeito a alterações</span>
                </div>
                <Tabs>
                  {Object.keys(cronograma).map(dia => (
                    <TabButton key={dia} $active={diaAtivo === dia} onClick={() => setDiaAtivo(dia)}>{dia}</TabButton>
                  ))}
                </Tabs>
                <ClassList>
                  {cronograma[diaAtivo].map((item, index) => (
                    <ClassCard key={index}>
                      <div className="time">{item.hora}</div>
                      <div className="info">
                        <h4>{item.estilo} <span className="badge">{item.nivel}</span></h4>
                        <p>Prof. {item.professor}</p>
                      </div>
                    </ClassCard>
                  ))}
                </ClassList>
              </ScheduleContainer>

              <FormCard>
                <h3>Garanta sua Vaga</h3>
                <p>Preencha seus dados e escolha a aula que deseja participar. As vagas são limitadas!</p>
                <form onSubmit={enviarInscricao}>
                  <label>Nome Completo</label>
                  <Input type="text" required value={inscricao.nome} placeholder="Ex: Maria Silva" onChange={e => setInscricao({...inscricao, nome: e.target.value})} />
                  <label>E-mail</label>
                  <Input type="email" required value={inscricao.email} placeholder="seu@email.com" onChange={e => setInscricao({...inscricao, email: e.target.value})} />
                  <label>Qual aula deseja fazer?</label>
                  <Select value={inscricao.aula} required onChange={e => setInscricao({...inscricao, aula: e.target.value})}>
                    <option value="" disabled>Selecione uma opção...</option>
                    {Object.entries(cronograma).map(([dia, aulas]) => (
                      <optgroup key={dia} label={`Dia ${dia}`}>
                        {aulas.map((aula, idx) => (
                          <option key={`${dia}-${idx}`} value={`${aula.estilo} (${dia} - ${aula.hora})`}>{aula.estilo} - {aula.hora}</option>
                        ))}
                      </optgroup>
                    ))}
                  </Select>
                  <Button type="submit" disabled={loading}>{loading ? 'Confirmando...' : 'REALIZAR INSCRIÇÃO'}</Button>
                </form>
              </FormCard>
            </MainContent>

            <ContactSection>
              <h3>Contato</h3>
              <IconContainer>
                <SocialLink href="https://www.instagram.com/poadancefestival/" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </SocialLink>
                <SocialLink href="mailto:poadancefestival@gmail.com">
                  <FaEnvelope />
                </SocialLink>
              </IconContainer>
            </ContactSection>

            <Footer>
              <p>Realização: <strong>GS2 Soluções Artísticas</strong></p>
              <p>Apoio: <strong>Prefeitura de Porto Alegre - Secretaria da Cultura</strong></p>
              <p style={{marginTop:'10px', fontSize:'0.85rem'}}>📍 Centro Lupicínio Rodrigues | Av. Érico Veríssimo, 307 - Menino Deus</p>
              <p style={{marginTop:'20px', fontSize: '0.7rem', opacity: 0.4}}>© 2026 POA Dance Festival</p>
            </Footer>
          </>
        } />
        <Route path="/admin" element={isAdminLogado ? (<AdminPanel onLogout={handleLogout} />) : (<Login onLoginSuccess={() => setIsAdminLogado(true)} />)} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;