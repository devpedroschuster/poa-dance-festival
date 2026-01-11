require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const nodemailer = require('nodemailer');

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
    folder: 'poa-dance-festival',
    resource_type: 'auto',
  },
});
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
  });

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

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://poadance-festival.vercel.app',
    'https://inmotion-festival.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json());


app.post('/api/inscrever', async (req, res) => {
  try {
    const novaInscricao = new Inscricao(req.body);
    await novaInscricao.save();
    
    console.log('Inscrição salva:', novaInscricao);

    const mailOptions = {
      from: 'POA Dance Festival <nao-responda@poadance.com>',
      to: novaInscricao.email,
      subject: 'Inscrição Confirmada! - POA Dance Festival 💃✨',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
          <h1 style="color: #ff4081;">Olá, ${novaInscricao.nome}!</h1> 
          
          <p>Sua inscrição para a aula de <strong>${novaInscricao.aula}</strong> foi confirmada com sucesso.</p>
          
          <p>Estamos ansiosos para ver você no <strong>POA Dance Festival</strong>!</p>
          <hr/>
          <p style="font-size: 12px; color: #888;">Equipe POA Dance Festival</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ mensagem: 'Sucesso!' });
  } catch (error) {
    console.error('Erro no processo:', error);
    res.status(500).json({ erro: 'Erro ao processar inscrição' });
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

    const mailOptions = {
      from: 'POA Dance Festival <nao-responda@poadance.com>',
      to: novaCoreografia.email,
      subject: 'Material Recebido! - POA Dance Festival 🎵',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
          <h1 style="color: #ff4081;">Olá, ${novaCoreografia.coreografo}!</h1>
          
          <p>Confirmamos o recebimento dos materiais da coreografia:</p>
          <h3 style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
            ${novaCoreografia.nomeCoreografia}
          </h3>
          
          <p>O arquivo de música e o link do vídeo já estão em nosso sistema.</p>
          <p>Nos vemos no palco!</p>
          <hr/>
          <p style="font-size: 12px; color: #888;">Equipe POA Dance Festival</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ mensagem: 'Coreografia recebida!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao salvar coreografia' });
  }
});

app.post('/api/login', (req, res) => {
  const { senha } = req.body;
  
  if (senha === process.env.ADMIN_PASSWORD) {
    res.json({ sucesso: true, token: 'acesso-liberado' });
  } else {
    res.status(401).json({ sucesso: false, mensagem: 'Senha incorreta!' });
  }
});

app.put('/api/inscricoes/:id', async (req, res) => {
  try {
    const atualizado = await Inscricao.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar inscrição' });
  }
});

app.delete('/api/coreografias/:id', async (req, res) => {
  try {
    await Coreografia.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensagem: 'Coreografia removida!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar coreografia' });
  }
});

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