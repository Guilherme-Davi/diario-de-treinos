require('dotenv').config();
const express=require('express');
const cors=require('cors');
const app=express();

app.use(cors({origin:process.env.FRONTEND_URL}));
app.use(express.json());
app.get('/api',(req,res)=>res.json({mensagem:'API funcionando.'}));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/exercicios',require('./routes/exercicios'));

app.listen(process.env.PORT||3000,()=>console.log('Servidor rodando na porta 3000.'));
