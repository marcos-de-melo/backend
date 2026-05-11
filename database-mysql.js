import { randomUUID } from "node:crypto";
import { sql } from "./db.js";

export class DatabaseMYSQL {

// Listagem de vídeos, com opção de busca por título usando o operador LIKE
    async list(search) {
        let videos;

        if (search) {
            // No mysql2, usamos o caractere "?" como placeholder para evitar SQL Injection
            // O resultado vem como [videos, fields], por isso usamos a desestruturação [videos]
            [videos] = await sql.execute(
                'SELECT * FROM videos WHERE title LIKE ?', 
                [`%${search}%`]
            );
        } else {
            [videos] = await sql.execute('SELECT * FROM videos');
        }

        return videos;
    }

// Criação de um novo vídeo, gerando um ID único usando randomUUID
    async create(video) {
        const videoId = randomUUID();
        const { title, description, duration } = video;

        // No mysql2, passamos os valores em um array como segundo argumento
        await sql.execute(
            'INSERT INTO videos (id, title, description, duration) VALUES (?, ?, ?, ?)',
            [videoId, title, description, duration]
        );
    }

// Atualização de um vídeo específico usando o ID
    async update(id, video) {
        const { title, description, duration } = video;
        await sql.execute(
            'UPDATE videos SET title = ?, description = ?, duration = ? WHERE id = ?',
            [title, description, duration, id]
        );
    }

// Exclusão de um vídeo específico usando o ID
    async delete(id) {
        await sql.execute('DELETE FROM videos WHERE id = ?', [id]);
    }
}

