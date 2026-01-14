import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const MAPA_LIMITES = {
  'Jazz Funk': 25,
  'Hip Hop': 40,
  'Contemporâneo': 30,
  'K-Pop': 35,
  'Stiletto': 20,
  'Ballet': 25
};
const LIMITE_PADRAO = 30;

// ESTILOS
const Container = styled.div`
  max-width: 1200px; margin: 0 auto; padding: 2rem;
  color: #fff; animation: fadeIn 0.5s;
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);
  h2 { margin: 0; color: #ff4081; }
`;

const DashboardGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px; margin-bottom: 3rem;
`;

const CardStats = styled.div`
  background: #1e1e1e; padding: 1.5rem; border-radius: 12px;
  border: 1px solid #333; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  
  h3 { margin: 0 0 1rem 0; font-size: 1rem; opacity: 0.7; text-transform: uppercase; }
  
  .aula-row {
    margin-bottom: 12px;
  }
  .aula-info {
    display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 4px;
  }
  .progress-bg {
    width: 100%; height: 8px; background: #333; border-radius: 4px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; transition: width 0.5s ease;
  }
`;

const TableContainer = styled.div`
  background: #1e1e1e; border-radius: 12px; overflow: hidden; border: 1px solid #333;
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; text-align: left;
  th, td { padding: 15px; border-bottom: 1px solid #333; }
  th { background: #252525; color: #ffcdd2; font-weight: 600; text-transform: uppercase; font-size: 0.85rem; }
  tr:hover { background: #2a2a2a; }
  td { font-size: 0.9rem; }
`;

const Button = styled.button`
  background: #d32f2f; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;
  &:hover { background: #b71c1c; }
`;

const LogoutBtn = styled.button`
  background: transparent; border: 1px solid rgba(255,255,255,0.3); color: white;
  padding: 8px 16px; border-radius: 20px; cursor: pointer; transition: all 0.3s;
  &:hover { border-color: #ff4081; color: #ff4081; }
`;

export default function AdminPanel({ onLogout }) {
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInscricoes();
  }, []);

  const fetchInscricoes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inscricoes`);
      if (res.ok) {
        const data = await res.json();
        setInscricoes(data);
      }
    } catch (error) { toast.error('Erro ao carregar dados.'); }
    setLoading(false);
  };

  const deletarInscricao = async (id) => {
    if (!confirm('Tem certeza que deseja remover este aluno?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/inscricoes/${id}`, { method: 'DELETE' });
      toast.success('Removido com sucesso!');
      fetchInscricoes();
    } catch (err) { toast.error('Erro ao deletar.'); }
  };

  const lotacao = inscricoes.reduce((acc, curr) => {
    acc[curr.aula] = (acc[curr.aula] || 0) + 1;
    return acc;
  }, {});

  const getStatusAula = (nomeAula, qtdAtual) => {
    let limite = LIMITE_PADRAO;
    for (const [estilo, qtd] of Object.entries(MAPA_LIMITES)) {
      if (nomeAula.includes(estilo)) limite = qtd;
    }
    
    const porcentagem = Math.min((qtdAtual / limite) * 100, 100);
    
    let cor = '#00e676';
    if (porcentagem > 70) cor = '#ffea00';
    if (porcentagem >= 100) cor = '#ff1744';

    return { limite, porcentagem, cor };
  };

  return (
    <Container>
      <Header>
        <div>
          <h2>Painel Administrativo</h2>
          <p style={{opacity:0.6, fontSize:'0.9rem'}}>Bem-vindo, Gestor.</p>
        </div>
        <LogoutBtn onClick={onLogout}>Sair do Sistema</LogoutBtn>
      </Header>

      <h3 style={{borderLeft:'4px solid #ff4081', paddingLeft:'10px'}}>Lotação das Turmas</h3>
      <DashboardGrid>
        {Object.keys(lotacao).length === 0 ? (
          <p style={{opacity:0.5}}>Nenhuma inscrição realizada ainda.</p>
        ) : (
          <CardStats>
            {Object.entries(lotacao).map(([aula, qtd]) => {
              const { limite, porcentagem, cor } = getStatusAula(aula, qtd);
              return (
                <div key={aula} className="aula-row">
                  <div className="aula-info">
                    <span>{aula}</span>
                    <strong style={{color: cor}}>{qtd} / {limite}</strong>
                  </div>
                  <div className="progress-bg">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${porcentagem}%`, background: cor }}
                    />
                  </div>
                </div>
              );
            })}
          </CardStats>
        )}

        <CardStats>
          <h3>Resumo Geral</h3>
          <h1 style={{fontSize:'3rem', margin:'0', color:'#ff4081'}}>{inscricoes.length}</h1>
          <p>Alunos Matriculados</p>
        </CardStats>
      </DashboardGrid>

      <h3 style={{borderLeft:'4px solid #ff4081', paddingLeft:'10px', marginTop:'3rem'}}>Lista de Alunos</h3>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Aula Selecionada</th>
              <th>Data Inscrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {inscricoes.map(insc => (
              <tr key={insc._id}>
                <td>
                  <strong>{insc.nome}</strong><br/>
                  <span style={{opacity:0.6, fontSize:'0.8rem'}}>{insc.email}</span>
                </td>
                <td>{insc.aula}</td>
                <td>{new Date(insc.data).toLocaleDateString()}</td>
                <td>
                  <Button onClick={() => deletarInscricao(insc._id)}>Remover</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}