// O array armazena instâncias de Funcionario, conforme o enunciado.
let funcionarios = [];
let proximoId = 1;
let idEmEdicao = null;

const formulario = document.getElementById('formulario');
const nome = document.getElementById('nome');
const idade = document.getElementById('idade');
const cargo = document.getElementById('cargo');
const salario = document.getElementById('salario');
const cadastrar = document.getElementById('cadastrar');
const cancelar = document.getElementById('cancelar');
const mensagem = document.getElementById('mensagem');
const moeda = valor => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Exercício 3: busca, remoção e atualização usando arrow functions.
const buscarFuncionario = id => funcionarios.find(funcionario => funcionario.id === id);
const removerFuncionario = id => {
  funcionarios = funcionarios.filter(funcionario => funcionario.id !== id);
};
const atualizarFuncionario = (id, dados) => {
  const funcionario = buscarFuncionario(id);
  if (!funcionario) throw new Error('Funcionário não encontrado.');
  funcionario.atualizar(dados.nome, dados.idade, dados.cargo, dados.salario);
};

const limparFormulario = () => {
  formulario.reset();
  idEmEdicao = null;
  
  cadastrar.textContent = 'Cadastrar';
  cancelar.hidden = true;
  document.getElementById('titulo-formulario').textContent = 'Cadastrar funcionário';
};

const editarFuncionario = id => {
  const funcionario = buscarFuncionario(id);
  if (!funcionario) return;
  idEmEdicao = id;
  nome.value = funcionario.nome;
  idade.value = funcionario.idade;
  cargo.value = funcionario.cargo;
  salario.value = funcionario.salario;
  cadastrar.textContent = 'Salvar alterações';
  cancelar.hidden = false;
  document.getElementById('titulo-formulario').textContent = 'Editar funcionário';
  mensagem.textContent = `Editando ${funcionario.nome}.`;
  nome.focus();
};

const excluirFuncionario = id => {
  const funcionario = buscarFuncionario(id);
  if (!funcionario) return;
  removerFuncionario(id);
  if (idEmEdicao === id) limparFormulario();
  renderizar();
  mensagem.textContent = `${funcionario.nome} excluído(a).`;
};

const listarFuncionarios = () => {
  const corpo = document.getElementById('lista-funcionarios');
  corpo.replaceChildren();
  document.getElementById('quantidade').textContent = `${funcionarios.length} funcionário${funcionarios.length === 1 ? '' : 's'}`;
  if (funcionarios.length === 0) {
    const linha = corpo.insertRow();
    const celula = linha.insertCell();
    celula.colSpan = 5;
    celula.className = 'vazio';
    celula.textContent = 'Nenhum funcionário cadastrado. Preencha o formulário para começar.';
  }
  funcionarios.forEach(funcionario => {
    const linha = corpo.insertRow();
    [funcionario.nome, funcionario.idade, funcionario.cargo, moeda(funcionario.salario)].forEach(valor => {
      // textContent trata os dados como texto, sem executar HTML digitado no formulário.
      linha.insertCell().textContent = valor;
    });
    const acoes = linha.insertCell();
    const editar = document.createElement('button');
    editar.type = 'button';
    editar.className = 'secundario';
    editar.textContent = 'Editar';
    editar.setAttribute('aria-label', `Editar ${funcionario.nome}`);
    // Exercícios 2 e 3: eventos onclick com funções anônimas tradicionais.
    editar.onclick = function () { editarFuncionario(funcionario.id); };
    const excluir = document.createElement('button');
    excluir.type = 'button';
    excluir.className = 'excluir';
    excluir.textContent = 'Excluir';
    excluir.setAttribute('aria-label', `Excluir ${funcionario.nome}`);
    excluir.onclick = function () { excluirFuncionario(funcionario.id); };
    acoes.append(editar, excluir);
  });
};

const preencherLista = (id, valores, vazio) => {
  const lista = document.getElementById(id);
  lista.replaceChildren();
  (valores.length ? valores : [vazio]).forEach(valor => {
    const item = document.createElement('li');
    item.textContent = valor;
    lista.append(item);
  });
};

// Exercício 4: relatórios dinâmicos com filter, map, reduce e Set.
const gerarRelatorios = () => {
  const salariosAltos = funcionarios.filter(funcionario => funcionario.salario > 5000);
  const total = funcionarios.reduce((soma, funcionario) => soma + funcionario.salario, 0);
  const media = funcionarios.length ? total / funcionarios.length : null;
  const cargosUnicos = [...new Set(funcionarios.map(funcionario => funcionario.cargo))];
  const nomesMaiusculos = funcionarios.map(funcionario => funcionario.nome.toLocaleUpperCase('pt-BR'));
  return { salariosAltos, media, cargosUnicos, nomesMaiusculos };
};

const renderizar = () => {
  listarFuncionarios();
  const relatorios = gerarRelatorios();
  preencherLista('salarios-altos', relatorios.salariosAltos.map(funcionario => funcionario.toString()), 'Nenhum funcionário com salário acima de R$ 5.000.');
  document.getElementById('media-salarial').textContent = relatorios.media === null ? 'Sem funcionários' : moeda(relatorios.media);
  preencherLista('cargos-unicos', relatorios.cargosUnicos, 'Nenhum cargo cadastrado.');
  preencherLista('nomes-maiusculos', relatorios.nomesMaiusculos, 'Nenhum nome cadastrado.');
};

const salvarFormulario = () => {
  if (!formulario.reportValidity()) return;
  try {
    const dados = { nome: nome.value, idade: idade.valueAsNumber, cargo: cargo.value, salario: salario.valueAsNumber };
    const editando = idEmEdicao !== null;
    if (editando) {
      atualizarFuncionario(idEmEdicao, dados);
    } else {
      const funcionario = new Funcionario(proximoId, dados.nome, dados.idade, dados.cargo, dados.salario);
      funcionarios.push(funcionario);
      proximoId++;
    }
    limparFormulario();
    renderizar();
    mensagem.textContent = editando ? 'Funcionário atualizado com sucesso.' : 'Funcionário cadastrado com sucesso.';
    nome.focus();
  } catch (erro) {
    mensagem.textContent = erro.message;
  }
};

cadastrar.onclick = function (evento) {
  evento.preventDefault();
  salvarFormulario();
};
formulario.onsubmit = function (evento) {
  evento.preventDefault();
  salvarFormulario();
};
cancelar.onclick = function () {
  limparFormulario();
  mensagem.textContent = 'Edição cancelada.';
  nome.focus();
};

// Exercício 3: substituição equivalente (exemplo didático, sem duplicar eventos).
// Tradicional: editar.onclick = function () { editarFuncionario(funcionario.id); };
// Arrow:       editar.onclick = () => editarFuncionario(funcionario.id);
renderizar();
