require('dotenv').config();
const fs=require('fs');
const db=require('./db');
(async()=>{
 try{
  await db.query(fs.readFileSync('database.sql','utf8'));
  console.log('Banco criado com sucesso.');
 }catch(e){console.error(e.message)}
 finally{await db.end()}
})();
