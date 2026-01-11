require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'inmotion-festival',
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB Atlas!'))
  .catch(err => console.error('❌ Erro ao conectar no Mongo:', err));

const InscricaoSchema = new mongoose.Schema({
  nome: String,
  email: String,
  aula: String,
  data: { type: Date, default: Date.now }
});
const Inscricao = mongoose.model('Inscricao', InscricaoSchema);

const CoreografiaSchema = new mongoose.Schema({
  nomeCoreografia: String,
  coreografo: String,
  descricao: String,
  email: String,
  videoLink: String,
  caminhoMusica: String,
  data: { type: Date, default: Date.now }
});
const Coreografia = mongoose.model('Coreografia', CoreografiaSchema);

app.use(cors());
app.use(express.json());


app.post('/api/inscrever', async (req, res) => {
  try {
    const novaInscricao = new Inscricao(req.body);
    await novaInscricao.save();
    console.log('Inscrição salva:', novaInscricao);
    res.status(201).json({ mensagem: 'Sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao salvar inscrição' });
  }
});

app.get('/api/inscricoes', async (req, res) => {
  try {
    const lista = await Inscricao.find();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar dados' });
  }
});

app.delete('/api/inscricoes/:id', async (req, res) => {
  try {
    await Inscricao.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensagem: 'Removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar' });
  }
});

app.get('/api/coreografias', async (req, res) => {
  try {
    const lista = await Coreografia.find();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar coreografias' });
  }
});

app.post('/api/submeter-coreografia', upload.single('musica'), async (req, res) => {
  if (!req.file) return res.status(400).json({ mensagem: 'Faltou a música!' });

  try {
    const novaCoreografia = new Coreografia({
      ...req.body,

      caminhoMusica: req.file.path
    });
    
    await novaCoreografia.save();
    
    console.log('Coreografia salva:', novaCoreografia.nomeCoreografia);
    res.status(201).json({ mensagem: 'Coreografia recebida!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao salvar coreografia' });
  }
});

app.post('/api/login', (req, res) => {
  const { senha } = req.body;
  
  // Compara a senha enviada com a que está no .env
  if (senha === process.env.ADMIN_PASSWORD) {
    res.json({ sucesso: true, token: 'acesso-liberado' });
  } else {
    res.status(401).json({ sucesso: false, mensagem: 'Senha incorreta!' });
  }
});

// 1. ATUALIZAR INSCRIÇÃO (AULA)
app.put('/api/inscricoes/:id', async (req, res) => {
  try {
    // O { new: true } serve para o Mongo devolver o dado já atualizado
    const atualizado = await Inscricao.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar inscrição' });
  }
});

// 2. DELETAR COREOGRAFIA
app.delete('/api/coreografias/:id', async (req, res) => {
  try {
    await Coreografia.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensagem: 'Coreografia removida!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar coreografia' });
  }
});

// 3. ATUALIZAR COREOGRAFIA (Dados de texto)
app.put('/api/coreografias/:id', async (req, res) => {
  try {
    const atualizado = await Coreografia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar coreografia' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});