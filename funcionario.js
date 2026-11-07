// Exercício 1: classe, atributos, construtor, métodos de acesso e toString().
class Funcionario {
  constructor(id, nome, idade, cargo, salario) {
    this._id = id;
    this.nome = nome;
    this.idade = idade;
    this.cargo = cargo;
    this.salario = salario;
  }

  get id() { return this._id; }
  get nome() { return this._nome; }
  set nome(valor) {
    if (typeof valor !== 'string' || !valor.trim()) throw new Error('Informe o nome.');
    this._nome = valor.trim();
  }
  get idade() { return this._idade; }
  set idade(valor) {
    if (!Number.isInteger(valor) || valor <= 0) throw new Error('Informe uma idade inteira maior que zero.');
    this._idade = valor;
  }
  get cargo() { return this._cargo; }
  set cargo(valor) {
    if (typeof valor !== 'string' || !valor.trim()) throw new Error('Informe o cargo.');
    this._cargo = valor.trim();
  }
  get salario() { return this._salario; }
  set salario(valor) {
    if (!Number.isFinite(valor) || valor < 0) throw new Error('Informe um salário válido, maior ou igual a zero.');
    this._salario = valor;
  }

  // Valida todos os campos antes de modificar o objeto original.
  atualizar(nome, idade, cargo, salario) {
    const dados = new Funcionario(this.id, nome, idade, cargo, salario);
    this.nome = dados.nome;
    this.idade = dados.idade;
    this.cargo = dados.cargo;
    this.salario = dados.salario;
  }

  toString() {
    return `${this.nome}, ${this.idade} anos, ${this.cargo}, ${this.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
  }
}
