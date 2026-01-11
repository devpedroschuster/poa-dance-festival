import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import API_URL from '../api';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: white;
  padding-bottom: 100px;
`;

const Title = styled.h2`
  text-align: center; color: #ff4081; margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: white; margin-top: 3rem; border-bottom: 1px solid #333; padding-bottom: 10px;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: #222;
  padding: 20px;
  border-radius: 10px;
  border-left: 5px solid ${props => props.color || '#ff4081'};
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  
  h4 { margin: 0; color: #aaa; font-size: 0.9rem; text-transform: uppercase; }
  p { margin: 10px 0 0 0; font-size: 2.5rem; font-weight: bold; color: white; }
`;

const ChartContainer = styled.div`
  background: #222;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 40px;
  height: 350px; /* Altura fixa para o gráfico */
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; margin-top: 1rem; background-color: #1a1a1a; border-radius: 8px; overflow: hidden;
`;
const Th = styled.th`background-color: #333; padding: 15px; text-align: left; color: #ff4081;`;
const Td = styled.td`padding: 15px; border-bottom: 1px solid #333; vertical-align: middle;`;
const ActionButton = styled.button`
  background-color: ${props => props.$color || '#ff4081'}; color: white; border: none; padding: 8px 12px; 
  border-radius: 4px; cursor: pointer; margin-right: 5px; font-weight: bold;
  &:hover { opacity: 0.8; }
`;
const LinkButton = styled.a`
  color: #ff4081; text-decoration: none; font-weight: bold; display: block; margin-bottom: 5px;
  &:hover { text-decoration: underline; }
`;

const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 1000;
`;
const ModalContent = styled.div`
  background: #222; padding: 30px; border-radius: 10px; width: 90%; max-width: 500px;
  border: 1px solid #ff4081;
`;
const FormGroup = styled.div`
  margin-bottom: 15px;
  label { display: block; margin-bottom: 5px; color: #ccc; }
  input, select { width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 5px; }
`;

export default function AdminPanel() {
  const [inscricoes, setInscricoes] = useState([]);
  const [coreografias, setCoreografias] = useState([]);
  
  const [editandoItem, setEditandoItem] = useState(null);
  const [tipoEdicao, setTipoEdicao] = useState(null);

  const carregarDados = () => {
    fetch(`${API_URL}/inscricoes`)
      .then(res => res.json())
      .then(dados => setInscricoes(dados))
      .catch(console.error);

    fetch(`${API_URL}/coreografias`)
      .then(res => res.json())
      .then(dados => setCoreografias(dados))
      .catch(console.error);
  };

  useEffect(() => { carregarDados(); }, []);

  const dadosGrafico = inscricoes.reduce((acc, curr) => {
    const aulaExistente = acc.find(item => item.name === curr.aula);
    if (aulaExistente) {
      aulaExistente.alunos += 1;
    } else {
      acc.push({ name: curr.aula, alunos: 1 });
    }
    return acc;
  }, []);

  const handleDelete = async (id, tipo) => {
    if (!window.confirm('Tem certeza?')) return;
    const endpoint = tipo === 'inscricao' ? '/inscricoes' : '/coreografias';
    try {
      const res = await fetch(`${API_URL}${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Removido!'); carregarDados(); }
    } catch (e) { toast.error('Erro de conexão.'); }
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    const endpoint = tipoEdicao === 'inscricao' ? '/inscricoes' : '/coreografias';
    try {
      const res = await fetch(`${API_URL}${endpoint}/${editandoItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editandoItem)
      });
      if (res.ok) { toast.success('Atualizado!'); setEditandoItem(null); carregarDados(); }
    } catch (e) { toast.error('Erro ao salvar.'); }
  };

  const abrirModal = (item, tipo) => { setEditandoItem({ ...item }); setTipoEdicao(tipo); };

// Função para alterar senha
  const handleAlterarSenha = async () => {
    const novaSenha = prompt("Digite a nova senha de Admin:");
    if (!novaSenha) return; // Se cancelar, para tudo

    const token = localStorage.getItem('poadance_token');

    try {
      const res = await fetch(`${API_URL}/alterar-senha`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token // Envia o crachá para o servidor deixar passar
        },
        body: JSON.stringify({ novaSenha })
      });
      
      if (res.ok) {
        toast.success('Senha alterada! 🔐');
      } else {
        toast.error('Erro ao alterar senha.');
      }
    } catch (error) {
      toast.error('Erro de conexão.');
    }
  };

  return (
    <Container>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button 
          onClick={handleAlterarSenha}
          style={{
            background: '#333', color: 'white', border: '1px solid #555', 
            padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem'
          }}
        >
          🔑 Alterar Senha
        </button>
      </div>
      
      <Title>Painel Administrativo 📊</Title>

      <DashboardGrid>
        <StatCard color="#2196F3">
          <h4>Total de Alunos</h4>
          <p>{inscricoes.length}</p>
        </StatCard>
        <StatCard color="#ff4081">
          <h4>Coreografias</h4>
          <p>{coreografias.length}</p>
        </StatCard>
        <StatCard color="#00E676">
          <h4>Faturamento (Est.)</h4>
          <p>R$ {inscricoes.length * 0},00</p>
        </StatCard>
      </DashboardGrid>

      <SectionTitle>Popularidade das Aulas</SectionTitle>
      <ChartContainer>
        {dadosGrafico.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico}>
              <XAxis dataKey="name" stroke="#ccc" tick={{fontSize: 12}} />
              <YAxis allowDecimals={false} stroke="#ccc" />
              <Tooltip 
                contentStyle={{backgroundColor: '#333', border: 'none', borderRadius: '5px'}}
                cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
              />
              <Bar dataKey="alunos" fill="#ff4081" radius={[5, 5, 0, 0]}>
                {dadosGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ff4081' : '#2196F3'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p style={{textAlign: 'center', paddingTop: '150px', color: '#666'}}>
            Ainda não há dados suficientes para o gráfico.
          </p>
        )}
      </ChartContainer>

      <SectionTitle>Lista de Alunos ({inscricoes.length})</SectionTitle>
      <Table>
        <thead>
          <tr>
            <Th>Nome</Th> <Th>Email</Th> <Th>Aula</Th> <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {inscricoes.map(item => (
            <tr key={item._id}>
              <Td>{item.nome}</Td> <Td>{item.email}</Td> <Td>{item.aula}</Td>
              <Td>
                <ActionButton $color="#2196F3" onClick={() => abrirModal(item, 'inscricao')}>✏️</ActionButton>
                <ActionButton $color="#f44336" onClick={() => handleDelete(item._id, 'inscricao')}>🗑️</ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <SectionTitle>Coreografias Enviadas ({coreografias.length})</SectionTitle>
      <Table>
        <thead>
          <tr><Th>Obra</Th> <Th>Mídia</Th> <Th>Ações</Th></tr>
        </thead>
        <tbody>
          {coreografias.map(item => (
            <tr key={item._id}>
              <Td>
                <strong>{item.nomeCoreografia}</strong><br/>
                <small>{item.coreografo}</small>
              </Td>
              <Td>
                <LinkButton href={item.videoLink} target="_blank">📺 Vídeo</LinkButton>
                <LinkButton href={item.caminhoMusica} target="_blank">🎵 Música</LinkButton>
              </Td>
              <Td>
                <ActionButton $color="#2196F3" onClick={() => abrirModal(item, 'coreografia')}>✏️</ActionButton>
                <ActionButton $color="#f44336" onClick={() => handleDelete(item._id, 'coreografia')}>🗑️</ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editandoItem && (
        <ModalOverlay onClick={() => setEditandoItem(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3>Editar</h3>
            <form onSubmit={handleSalvarEdicao}>
              <FormGroup>
                <label>Nome</label>
                <input 
                  value={tipoEdicao === 'inscricao' ? editandoItem.nome : editandoItem.nomeCoreografia} 
                  onChange={e => setEditandoItem({...editandoItem, [tipoEdicao === 'inscricao' ? 'nome' : 'nomeCoreografia']: e.target.value})}
                />
              </FormGroup>
              <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                <ActionButton type="submit" $color="#4CAF50" style={{flex: 1}}>Salvar</ActionButton>
                <ActionButton type="button" $color="#555" onClick={() => setEditandoItem(null)} style={{flex: 1}}>Cancelar</ActionButton>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

    </Container>
  );
}