const router=require('express').Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const db=require('../db');

router.post('/cadastro',async(req,res)=>{
 const {nome,email,senha}=req.body;
 if(!nome||!email||!senha) return res.status(400).json({mensagem:'Preencha todos os campos.'});
 const existe=await db.query('SELECT id FROM usuarios WHERE email=$1',[email]);
 if(existe.rows[0]) return res.status(400).json({mensagem:'E-mail já cadastrado.'});
 const hash=await bcrypt.hash(senha,10);
 const r=await db.query(
  'INSERT INTO usuarios(nome,email,senha) VALUES($1,$2,$3) RETURNING id,nome,email',
  [nome,email,hash]
 );
 res.status(201).json(r.rows[0]);
});

router.post('/login',async(req,res)=>{
 const {email,senha}=req.body;
 const r=await db.query('SELECT * FROM usuarios WHERE email=$1',[email]);
 const usuario=r.rows[0];
 if(!usuario||!(await bcrypt.compare(senha,usuario.senha)))
  return res.status(401).json({mensagem:'E-mail ou senha inválidos.'});
 const token=jwt.sign({id:usuario.id,email:usuario.email},process.env.JWT_SECRET,{expiresIn:'2h'});
 res.json({token,usuario:{id:usuario.id,nome:usuario.nome,email:usuario.email}});
});

module.exports=router;
