require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
//const nodemailer = require('nodemailer'); Deixando por enquanto, mas não funcionou (timeout)
const { Resend } = require('resend');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_padrao_dev';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'poadance-festival',
    resource_type: 'auto',
  },
});
const upload = multer({ storage: storage });

const resend = new Resend(process.env.RESEND_API_KEY);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Conectado!'))
  .catch(err => console.error('❌ Erro Mongo:', err));

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

const UsuarioSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});
const Usuario = mongoose.model('Usuario', UsuarioSchema);

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://poadance-festival.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


app.post('/api/login', async (req, res) => {
  const { login, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ login });
    if (!usuario) return res.status(400).json({ sucesso: false, mensagem: 'Usuário não encontrado!' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(400).json({ sucesso: false, mensagem: 'Senha incorreta!' });

    const token = jwt.sign({ id: usuario._id, login: usuario.login }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ sucesso: true, token });
  } catch (error) {
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

app.post('/api/inscrever', async (req, res) => {
  try {
    const novaInscricao = new Inscricao(req.body);
    await novaInscricao.save();
    
await resend.emails.send({
      from: 'POA Dance Festival <onboarding@resend.dev>',
      to: novaInscricao.email,
      subject: 'Inscrição Confirmada! - POA Dance Festival 💃✨',
      html: `<h1>Olá, ${novaInscricao.nome}!</h1><p>Sua inscrição em <strong>${novaInscricao.aula}</strong> foi confirmada.</p>`
    });
    // ----------------------------------------

    res.status(201).json({ mensagem: 'Sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar inscrição:', error);
    res.status(500).json({ erro: 'Erro ao processar inscrição' });
  }
});

app.get('/api/inscricoes', async (req, res) => {
  try {
    const lista = await Inscricao.find();
    res.json(lista);
  } catch (error) { res.status(500).json({ erro: 'Erro ao buscar dados' }); }
});

app.delete('/api/inscricoes/:id', async (req, res) => {
  try {
    await Inscricao.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensagem: 'Removido!' });
  } catch (error) { res.status(500).json({ erro: 'Erro ao deletar' }); }
});

app.put('/api/inscricoes/:id', async (req, res) => {
  try {
    const atualizado = await Inscricao.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (error) { res.status(500).json({ erro: 'Erro ao atualizar' }); }
});

app.get('/api/coreografias', async (req, res) => {
  try {
    const lista = await Coreografia.find();
    res.json(lista);
  } catch (error) { res.status(500).json({ erro: 'Erro ao buscar' }); }
});

app.post('/api/submeter-coreografia', upload.single('musica'), async (req, res) => {
  if (!req.file) return res.status(400).json({ mensagem: 'Faltou a música!' });
  try {
    const novaCoreografia = new Coreografia({
      ...req.body,
      caminhoMusica: req.file.path
    });
    await novaCoreografia.save();
    
await resend.emails.send({
      from: 'POA Dance Festival <onboarding@resend.dev>', // Email obrigatório para testes
      to: novaCoreografia.email,
      subject: 'Material Recebido! - POA Dance Festival 🎵',
      html: `<h1>Olá, ${novaCoreografia.coreografo}!</h1><p>Recebemos <strong>${novaCoreografia.nomeCoreografia}</strong> com sucesso.</p>`
    });
    
    res.status(201).json({ mensagem: 'Sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar inscrição:', error); // Bom para ver erros no log
    res.status(500).json({ erro: 'Erro ao processar inscrição' });
  }
});

app.delete('/api/coreografias/:id', async (req, res) => {
  try {
    await Coreografia.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensagem: 'Removido!' });
  } catch (error) { res.status(500).json({ erro: 'Erro ao deletar' }); }
});

app.put('/api/coreografias/:id', async (req, res) => {
  try {
    const atualizado = await Coreografia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (error) { res.status(500).json({ erro: 'Erro ao atualizar' }); }
});

app.put('/api/alterar-senha', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ mensagem: 'Acesso negado' });
  try {
    jwt.verify(token, JWT_SECRET);
    const { novaSenha } = req.body;
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);
    await Usuario.findOneAndUpdate({ login: 'admin' }, { senha: senhaHash });
    res.json({ sucesso: true });
  } catch (error) { res.status(403).json({ mensagem: 'Token inválido' }); }
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  const adminExiste = await Usuario.findOne({ login: 'admin' });
  if (!adminExiste) {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash('admin123', salt);
    await new Usuario({ login: 'admin', senha: senhaHash }).save();
    console.log('✅ Admin criado: admin / admin123');
  }
});