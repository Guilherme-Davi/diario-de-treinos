const API='http://localhost:3000/api';
const auth=document.getElementById('auth'),app=document.getElementById('app'),lista=document.getElementById('lista');
const campoId=document.getElementById('id'),campoNome=document.getElementById('nome'),campoCategoria=document.getElementById('categoria');

function token(){return localStorage.getItem('token')}
async function api(url,opcoes={}){
 const headers={'Content-Type':'application/json',...(opcoes.headers||{})};
 if(token()) headers.Authorization='Bearer '+token();
 const r=await fetch(API+url,{...opcoes,headers});
 if(r.status===204)return;
 const dados=await r.json();
 if(!r.ok)throw new Error(dados.mensagem);
 return dados;
}
function tela(){
 const logado=!!token();
 auth.classList.toggle('d-none',logado);
 app.classList.toggle('d-none',!logado);
 if(logado)listar();
}
cadastro.onsubmit=async e=>{
 e.preventDefault();
 try{
  await api('/auth/cadastro',{method:'POST',body:JSON.stringify({
   nome:nomeUsuario.value,email:emailUsuario.value,senha:senhaUsuario.value
  })});
  alert('Cadastro realizado. Faça login.');
  e.target.reset();
 }catch(err){alert(err.message)}
};
login.onsubmit=async e=>{
 e.preventDefault();
 try{
  const d=await api('/auth/login',{method:'POST',body:JSON.stringify({
   email:loginEmail.value,senha:loginSenha.value
  })});
  localStorage.setItem('token',d.token);tela();
 }catch(err){alert(err.message)}
};
form.onsubmit=async e=>{
 e.preventDefault();
 const exercicioId=campoId.value;
 await api(exercicioId?'/exercicios/'+exercicioId:'/exercicios',{
  method:exercicioId?'PUT':'POST',
  body:JSON.stringify({nome:campoNome.value,categoria:campoCategoria.value})
 });
 limpar();listar();
};
async function listar(){
 const dados=await api('/exercicios');
 lista.innerHTML=dados.map(x=>`<article class="card treino">
 <h3>${x.nome}</h3><p>Categoria: ${x.categoria}</p>
 <button class="btn btn-warning btn-sm" onclick="editar(${x.id},'${x.nome}','${x.categoria}')">Editar</button>
 <button class="btn btn-danger btn-sm" onclick="excluir(${x.id})">Excluir</button>
 </article>`).join('');
}
window.editar=(i,n,c)=>{
 campoId.value=i;campoNome.value=n;campoCategoria.value=c;
 titulo.textContent='Editar exercício';cancelar.classList.remove('d-none');
};
window.excluir=async i=>{if(confirm('Deseja excluir?')){await api('/exercicios/'+i,{method:'DELETE'});listar()}};
function limpar(){form.reset();campoId.value='';titulo.textContent='Novo exercício';cancelar.classList.add('d-none')}
cancelar.onclick=limpar;
sair.onclick=()=>{localStorage.removeItem('token');tela()};
tela();
