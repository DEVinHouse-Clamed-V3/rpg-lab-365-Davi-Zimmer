const express = require('express');
const path = require('path'); // Para lidar com caminhos de diretórios

const app = express();

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'dist')));

// Definindo a porta do servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


/**
 const express = require('express');
const path = require('path'); // Para lidar com caminhos de diretórios

const app = express();

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Definindo a porta do servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 
 */