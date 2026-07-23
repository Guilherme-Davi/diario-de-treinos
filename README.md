# Diário de Treinos — versão simples

Projeto full-stack com Node.js, Express, PostgreSQL, JWT e CRUD.

## Para rodar

1. `npm install`
2. Crie no PostgreSQL o banco `diario_treinos`
3. Copie `.env.example` para `.env` e coloque sua senha
4. `npm run db:init`
5. `npm run dev`
6. Abra `frontend/index.html` com Live Server

## Estrutura

- Cadastro e login
- JWT
- CRUD de exercícios
- Duas tabelas relacionadas: `usuarios` e `exercicios`