const router=require('express').Router();
const db=require('../db');
const auth=require('../middleware/auth');
router.use(auth);

router.get('/',async(req,res)=>{
 const r=await db.query('SELECT * FROM exercicios WHERE usuario_id=$1 ORDER BY id DESC',[req.usuario.id]);
 res.json(r.rows);
});

router.post('/',async(req,res)=>{
 const {nome,categoria}=req.body;
 if(!nome||!categoria) return res.status(400).json({mensagem:'Preencha todos os campos.'});
 const r=await db.query(
  'INSERT INTO exercicios(nome,categoria,usuario_id) VALUES($1,$2,$3) RETURNING *',
  [nome,categoria,req.usuario.id]
 );
 res.status(201).json(r.rows[0]);
});

router.put('/:id',async(req,res)=>{
 const {nome,categoria}=req.body;
 const r=await db.query(
  'UPDATE exercicios SET nome=$1,categoria=$2 WHERE id=$3 AND usuario_id=$4 RETURNING *',
  [nome,categoria,req.params.id,req.usuario.id]
 );
 if(!r.rows[0]) return res.status(403).json({mensagem:'Acesso negado.'});
 res.json(r.rows[0]);
});

router.delete('/:id',async(req,res)=>{
 const r=await db.query(
  'DELETE FROM exercicios WHERE id=$1 AND usuario_id=$2 RETURNING id',
  [req.params.id,req.usuario.id]
 );
 if(!r.rows[0]) return res.status(403).json({mensagem:'Acesso negado.'});
 res.status(204).send();
});

module.exports=router;
