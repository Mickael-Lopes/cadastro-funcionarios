const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

// Executa as regras reais da aplicação sem depender de bibliotecas externas.
const criarContexto = () => {
  const contexto = vm.createContext({ document: { getElementById: () => ({}) } });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../funcionario.js'), 'utf8'), contexto);
  const app = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  vm.runInContext(app.replace(/renderizar\(\);\s*$/, ''), contexto);
  return codigo => vm.runInContext(codigo, contexto);
};

test('construtor, getters, setters e representação textual', () => {
  const executar = criarContexto();
  executar("const f = new Funcionario(1, ' Ana ', 25, ' Dev ', 6000); f.idade = 26;");
  assert.equal(executar('f.nome'), 'Ana');
  assert.equal(executar('f.cargo'), 'Dev');
  assert.equal(executar('f.idade'), 26);
  assert.match(executar('f.toString()'), /Ana, 26 anos, Dev/);
  assert.throws(() => executar('f.salario = -1'));
  assert.throws(() => executar('f.idade = 2.5'));
  assert.throws(() => executar("f.nome = ' '"));
});

test('edição preserva identidade e alteração inválida não modifica o funcionário', () => {
  const executar = criarContexto();
  executar("funcionarios.push(new Funcionario(1, 'Ana', 25, 'Dev', 6000)); const original = funcionarios[0];");
  executar("atualizarFuncionario(1, { nome: 'Ana Maria', idade: 26, cargo: 'Líder', salario: 8000 });");
  assert.equal(executar('buscarFuncionario(1) === original'), true);
  assert.equal(executar('original.salario'), 8000);
  assert.throws(() => executar("original.atualizar('Outro', 27, 'Dev', -1)"));
  assert.equal(executar('original.nome'), 'Ana Maria');
});

test('relatórios respeitam limite estrito, média, cargos únicos e acentuação', () => {
  const executar = criarContexto();
  executar("funcionarios = [new Funcionario(1, 'José', 30, 'Dev', 5000), new Funcionario(2, 'Ana', 25, 'Dev', 7000), new Funcionario(3, 'Bia', 22, 'Estágio', 0)];");
  assert.equal(executar('gerarRelatorios().salariosAltos.length'), 1);
  assert.equal(executar('gerarRelatorios().salariosAltos[0].id'), 2);
  assert.equal(executar('gerarRelatorios().media'), 4000);
  assert.equal(executar('gerarRelatorios().cargosUnicos.join(",")'), 'Dev,Estágio');
  assert.equal(executar('gerarRelatorios().nomesMaiusculos[0]'), 'JOSÉ');
  executar('removerFuncionario(2)');
  assert.equal(executar('buscarFuncionario(2)'), undefined);
  assert.equal(executar('gerarRelatorios().media'), 2500);
});

test('lista vazia não gera NaN ou divisão por zero', () => {
  const executar = criarContexto();
  assert.equal(executar('gerarRelatorios().media'), null);
  assert.equal(executar('gerarRelatorios().cargosUnicos.length'), 0);
});
