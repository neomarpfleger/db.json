// Importa as dependências necessárias
const jsonServer = require('json-server');
const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();  // Carrega variáveis de ambiente do arquivo .env

// Cria o servidor JSON Server e Express
const server = jsonServer.create();

// Define a porta a partir das variáveis de ambiente ou padrão para 3000
const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || 'db.json';  // Usa db.json como padrão, mas permite configuração via .env

// Função para configurar o roteador com base no db.json ou uma URL remota
let router;
if (fs.existsSync(DB_FILE)) {
    // Usa o arquivo local `db.json` se ele existir
    router = jsonServer.router(DB_FILE);
} else {
    console.warn(`Arquivo ${DB_FILE} não encontrado. Por favor, verifique o caminho.`);
    // Adiciona um roteador vazio ou uma mensagem de erro
    router = jsonServer.router({ message: 'Database não encontrado' });
}

// Middlewares padrão do JSON Server
const middlewares = jsonServer.defaults();
server.use(middlewares);

// Reescritas de rotas para flexibilidade na API
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
}));

// Middleware opcional para logs detalhados de requisições (útil em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
    server.use((req, res, next) => {
        console.log(`[LOG] ${req.method} request to ${req.url}`);
        next();
    });
}

// Define o roteador configurado
server.use(router);

// Inicializa o servidor e exibe mensagem de sucesso na inicialização
server.listen(PORT, () => {
    console.log(`JSON Server está rodando na porta ${PORT}`);
});

module.exports = server;
