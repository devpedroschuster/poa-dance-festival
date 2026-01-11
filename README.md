# 💃 POA Dance Festival - Plataforma de Gestão de Eventos

> Uma solução Full Stack completa para gerenciamento de matrículas, submissão de obras artísticas e administração de eventos de dança.

![Status do Projeto](https://img.shields.io/badge/STATUS-FINALIZADO-brightgreen)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## 🎯 Sobre o Projeto

O **POA Dance Festival** é uma aplicação web desenvolvida para modernizar o processo de inscrição de um grande festival de dança. O sistema resolve a dor de cabeça de gerenciar inscrições manuais, permitindo que alunos se matriculem em workshops e coreógrafos enviem seus materiais (música e vídeo) de forma 100% digital e centralizada.

### 🌟 Funcionalidades Principais

* **Área Pública (Front-end):**
    * Landing Page responsiva com programação do evento.
    * Formulário de Matrícula em Workshops.
    * Sistema de Submissão de Coreografias (Upload de MP3 + Link de Vídeo).
    * Envio automático de **E-mail de Confirmação** para o participante.

* **Painel Administrativo (Back-end & Admin):**
    * **Dashboard Visual:** Gráficos em tempo real (Recharts) mostrando estatísticas de inscrições.
    * **Autenticação Segura:** Sistema de Login com **JWT (JSON Web Tokens)** e senhas criptografadas com **BCrypt**.
    * **Gestão de Arquivos:** Integração com **Cloudinary** para armazenamento de músicas na nuvem.
    * **CRUD Completo:** O administrador pode visualizar, editar e excluir inscrições ou obras.
    * **Downloads:** Acesso direto aos arquivos de áudio e vídeo enviados pelos coreógrafos.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando a stack **MERN** (MongoDB, Express, React, Node.js):

* **Front-end:** React.js, Styled-components, React Router DOM, Recharts (Dashboards).
* **Back-end:** Node.js, Express.js.
* **Banco de Dados:** MongoDB Atlas (NoSQL).
* **Segurança:** JWT (Autenticação), BCrypt (Hash de senhas), Cors.
* **Serviços Externos:**
    * **Cloudinary:** Upload e gestão de mídia.
    * **Nodemailer + Gmail:** Disparo de e-mails transacionais.
* **Deploy:** Vercel (Front-end) e Render (Back-end).

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js instalado.
* Conta no MongoDB Atlas, Cloudinary e Gmail (para envio de e-mails).

### 1. Clone o repositório
```bash
git clone https://github.com/devpedroschuster/poa-dance-festival.git
cd poa-dance-festival

2. Configuração do Back-end (Server)

cd server
npm install

Crie um arquivo .env na pasta server com as seguintes variáveis:

MONGO_URI=sua_string_de_conexao_mongo
PORT=3000
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app_gmail
JWT_SECRET=sua_chave_secreta_jwt

Inicie o servidor:

npm start
# O servidor rodará em http://localhost:3000
# Um usuário admin padrão será criado no primeiro uso (Login: admin / Senha: admin123)

3. Configuração do Front-end (Client)
Em um novo terminal, volte para a raiz e entre na pasta client (ou onde estiver seu React):

cd client
npm install

Crie um arquivo .env na pasta client (se necessário configurar a URL da API):

VITE_API_URL=http://localhost:3000/api

Inicie o Front-end:

npm run dev

🔐 Acesso ao Painel Admin
Para acessar a área restrita, navegue até /admin (ex: http://localhost:5173/admin).

Usuário Padrão: admin

Senha Padrão: admin123

(Recomenda-se alterar a senha no primeiro acesso através do botão no Dashboard)

🎨 Layout e Design
O design foi pensado para transmitir a energia da dança, utilizando um tema escuro (Dark Mode) com acentos em Neon Pink (#ff4081), garantindo modernidade e foco no conteúdo visual.

Desenvolvido por Pedro Schuster 🚀