require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL
  })
);

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ mensagem: "API funcionando." });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/exercicios", require("./routes/exercicios"));

async function iniciarServidor() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS exercicios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        usuario_id INTEGER NOT NULL
          REFERENCES usuarios(id)
          ON DELETE CASCADE
      );
    `);

    console.log("Tabelas verificadas com sucesso.");

    const porta = process.env.PORT || 3000;

    app.listen(porta, () => {
      console.log(`Servidor rodando na porta ${porta}.`);
    });
  } catch (erro) {
    console.error("Erro ao iniciar o servidor:", erro.message);
  }
}

iniciarServidor();
