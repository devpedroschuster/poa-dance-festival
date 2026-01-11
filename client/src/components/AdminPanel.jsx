import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import API_URL from '../api';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: white;
  padding-bottom: 100px; /* Espaço para o botão secreto não cobrir nada */
`;

const Title = styled.h2`
  text-align: center; color: #ff4081; margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: white; margin-top: 3rem; border-bottom: 1px solid #333; padding-bottom: 10px;
  display: flex; justify-content: space-between; align-items: center;
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; margin-top: 1rem; background-color: #1a1a1a; border-radius: 8px; overflow: hidden;
`;

const Th = styled.th`
  background-color: #333; padding: 15px; text-align: left; color: #ff4081;
`;

const Td = styled.td`
  padding: 15px; border-bottom: 1px solid #333; vertical-align: middle;
`;

const ActionButton = styled.button`
  background-color: ${props => props.$color || '#ff4081'};
  color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;
  margin-right: 5px; font-weight: bold; font-size: 0.9rem;
  &:hover { opacity: 0.8; }
`;

const LinkButton = styled.a`
  color: #ff4081; text-decoration: none; font-weight: bold; display: block; margin-bottom: 5px;
  &:hover { text-decoration: underline; }
`;

// --- ESTILOS DO MODAL DE EDIÇÃO ---
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 1000;
`;

const ModalContent = styled.div`
  background: #222; padding: 30px; border-radius: 10px; width: 90%; max-width: 500px;
  border: 1px solid #ff4081; position: relative;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  label { display: block; margin-bottom: 5px; color: #ccc; }
  input, textarea, select {
    width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 5px;
  }
`;

export default function AdminPanel() {
  const [inscricoes, setInscricoes] = useState([]);
  const [coreografias, setCoreografias] = useState([]);
  
  // Estados para Edição
  const [editandoItem, setEditandoItem] = useState(null); // O objeto sendo editado
  const [tipoEdicao, setTipoEdicao] = useState(null); // 'inscricao' ou 'coreografia'

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

  useEffect(() => {
    carregarDados();
  }, []);

  // --- FUNÇÕES DE DELETAR ---
  const handleDelete = async (id, tipo) => {
    if (!window.confirm('Tem certeza que deseja excluir? Essa ação não pode ser desfeita.')) return;

    const endpoint = tipo === 'inscricao' ? '/inscricoes' : '/coreografias';
    
    try {
      const res = await fetch(`${API_URL}${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Removido com sucesso!');
        carregarDados();
      } else {
        toast.error('Erro ao remover.');
      }
    } catch (error) {
      toast.error('Erro de conexão.');
    }
  };

  // --- FUNÇÕES DE EDITAR ---
  const abrirModalEdicao = (item, tipo) => {
    setEditandoItem({ ...item }); // Cria uma cópia para não alterar a tabela direto
    setTipoEdicao(tipo);
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

      if (res.ok) {
        toast.success('Atualizado com sucesso! 💾');
        setEditandoItem(null); // Fecha o modal
        carregarDados(); // Recarrega a tabela
      } else {
        toast.error('Erro ao atualizar.');
      }
    } catch (error) {
      toast.error('Erro ao salvar.');
    }
  };

  return (
    <Container>
      <Title>Painel Administrativo 🛠️</Title>
      
      {/* === TABELA 1: MATRÍCULAS === */}
      <SectionTitle>Matrículas nas Aulas ({inscricoes.length})</SectionTitle>
      <Table>
        <thead>
          <tr>
            <Th>Nome</Th> <Th>Email</Th> <Th>Aula</Th> <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {inscricoes.map(item => (
            <tr key={item._id}>
              <Td>{item.nome}</Td>
              <Td>{item.email}</Td>
              <Td>{item.aula}</Td>
              <Td>
                <ActionButton $color="#2196F3" onClick={() => abrirModalEdicao(item, 'inscricao')}>
                  ✏️
                </ActionButton>
                <ActionButton $color="#f44336" onClick={() => handleDelete(item._id, 'inscricao')}>
                  🗑️
                </ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* === TABELA 2: COREOGRAFIAS === */}
      <SectionTitle>Coreografias ({coreografias.length})</SectionTitle>
      <Table>
        <thead>
          <tr>
            <Th>Obra / Coreógrafo</Th>
            <Th>Arquivos</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {coreografias.map(item => (
            <tr key={item._id}>
              <Td>
                <strong>{item.nomeCoreografia}</strong><br/>
                <small>{item.coreografo}</small><br/>
                <small style={{color:'#999'}}>{item.email}</small>
              </Td>
              <Td>
                <LinkButton href={item.videoLink} target="_blank">Ver Vídeo 📺</LinkButton>
                <LinkButton 
                   href={item.caminhoMusica?.startsWith('http') ? item.caminhoMusica : `${API_URL}/${item.caminhoMusica?.replace(/\\/g, '/')}`} 
                   target="_blank"
                >
                  Baixar Música 🎵
                </LinkButton>
              </Td>
              <Td>
                <ActionButton $color="#2196F3" onClick={() => abrirModalEdicao(item, 'coreografia')}>
                  ✏️
                </ActionButton>
                <ActionButton $color="#f44336" onClick={() => handleDelete(item._id, 'coreografia')}>
                  🗑️
                </ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* === MODAL FLUTUANTE DE EDIÇÃO === */}
      {editandoItem && (
        <ModalOverlay onClick={() => setEditandoItem(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3>Editar {tipoEdicao === 'inscricao' ? 'Inscrição' : 'Coreografia'}</h3>
            
            <form onSubmit={handleSalvarEdicao}>
              {/* CAMPOS COMUNS */}
              <FormGroup>
                <label>Nome (Aluno ou Obra)</label>
                <input 
                  type="text" 
                  value={tipoEdicao === 'inscricao' ? editandoItem.nome : editandoItem.nomeCoreografia} 
                  onChange={e => setEditandoItem({
                    ...editandoItem, 
                    [tipoEdicao === 'inscricao' ? 'nome' : 'nomeCoreografia']: e.target.value
                  })}
                />
              </FormGroup>

              <FormGroup>
                <label>Email de Contato</label>
                <input 
                  type="text" 
                  value={editandoItem.email} 
                  onChange={e => setEditandoItem({...editandoItem, email: e.target.value})}
                />
              </FormGroup>

              {/* CAMPOS SÓ DE INSCRIÇÃO */}
              {tipoEdicao === 'inscricao' && (
                <FormGroup>
                  <label>Aula Escolhida</label>
                  <select 
                    value={editandoItem.aula}
                    onChange={e => setEditandoItem({...editandoItem, aula: e.target.value})}
                  >
                    <option>Jazz Funk - Iniciante</option>
                    <option>Street Dance - Intermediário</option>
                    <option>Ballet Clássico - Avançado</option>
                    <option>K-Pop Cover</option>
                  </select>
                </FormGroup>
              )}

              {/* CAMPOS SÓ DE COREOGRAFIA */}
              {tipoEdicao === 'coreografia' && (
                <>
                  <FormGroup>
                    <label>Nome do Coreógrafo</label>
                    <input 
                      type="text" 
                      value={editandoItem.coreografo} 
                      onChange={e => setEditandoItem({...editandoItem, coreografo: e.target.value})}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Link do Vídeo</label>
                    <input 
                      type="text" 
                      value={editandoItem.videoLink} 
                      onChange={e => setEditandoItem({...editandoItem, videoLink: e.target.value})}
                    />
                  </FormGroup>
                  {/* Nota: Não permitimos editar o arquivo de música aqui para não complicar, 
                      apenas os textos. Se errar a música, melhor excluir e enviar de novo. */}
                </>
              )}

              <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                <ActionButton type="submit" $color="#4CAF50" style={{flex: 1}}>Salvar Alterações</ActionButton>
                <ActionButton type="button" $color="#555" onClick={() => setEditandoItem(null)} style={{flex: 1}}>Cancelar</ActionButton>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

    </Container>
  );
}