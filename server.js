import { fastify } from 'fastify';
import { DatabaseMYSQL } from './database-mysql.js';
import 'dotenv/config';
const { PORT } = process.env;

console.log('Variáveis de ambiente carregadas:', { PORT });

const server = fastify();

server.get('/', async (request, reply) => {
  return { message: 'API server - Gestor de Vídeos' };
});



// Criando uma instância da classe DatabaseMYSQL para 
// interagir com o banco de dados
const database = new DatabaseMYSQL();


// Rota para criar um novo vídeo, recebendo os dados no corpo 
// da requisição e usando o método create do database
server.post("/videos", async (request, reply) => {
    const { title, description, duration } = request.body;
    await database.create({
        title,
        description,
        duration
    });
    console.log(await database.list());
    return reply.status(201).send();
})

// Rota para listar os vídeos, com opção de busca por título 
// usando query string e o método list do database
server.get("/videos", async (request) => {
    const search = request.query.search;
    console.log(search);
    const videos = await database.list(search);
    return videos
})

// Rota para atualizar um vídeo específico, recebendo o 
// ID na URL e os dados no corpo da requisição, usando o 
// método update do database
server.put("/videos/:id", async (request,reply) => {

    const videoId = request.params.id;
    const { title, description, duration } = request.body;

    const video = await database.update(videoId, {
        title,
        description,
        duration,
    });

    return reply.status(204).send();
})

// Rota para excluir um vídeo específico, recebendo o ID na 
// URL e usando o método delete do database
server.delete("/videos/:id", async (request, reply) => {
    const videoId = request.params.id;
    await database.delete(videoId);
    return reply.status(204).send();
})

server.listen({port:PORT}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Servidor rodando em ${address}`);
});






