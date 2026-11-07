# EC02 - Gestão de Funcionários

Atividade em HTML, CSS e JavaScript puro: cadastro, listagem, alteração, exclusão e relatórios de funcionários de uma startup de tecnologia.

## Executar no VS Code com Docker

Pré-requisitos: VS Code e Docker Desktop instalado e iniciado, usando containers Linux.

1. Abra esta pasta no VS Code.
2. No terminal integrado, na pasta que contém `compose.yaml`, execute:

   ```sh
   docker compose up --build -d
   ```

   O comando constrói a imagem e inicia o container em segundo plano. É necessário incluir `up`: `docker compose --build` sozinho não inicia a aplicação.
3. Acesse **<http://localhost:8086>** no navegador.
4. Edite os arquivos no VS Code e recarregue a página. O volume do Compose compartilha o código com o container.
5. Para encerrar, execute `docker compose down`.

O Compose encaminha a porta **8086 do computador** para a porta **8080 do container**. Por isso, mesmo que o log mostre `http://localhost:8080`, ao executar com Docker use **http://localhost:8086** no navegador.

Também é possível usar **Terminal > Executar Tarefa > Iniciar com Docker**. Essa tarefa executa em primeiro plano: mantenha o terminal em execução; pressionar `Ctrl+C` encerra a aplicação. Para abrir o próprio ambiente de desenvolvimento dentro do container, instale a extensão **Dev Containers** e execute **Dev Containers: Reopen in Container** na paleta de comandos. A configuração está em `.devcontainer/devcontainer.json`.

Para uma consulta rápida sem Docker, abra `index.html` no navegador ou execute `npm start` com Node.js 22 ou superior (porta local 8080). Essa alternativa não substitui o requisito de desenvolvimento em Docker do enunciado.

### Se o localhost não abrir

Baixe a extensão do VS Code que se chama Go Live e rode a aplicação por essa extensão.

## Como usar

- Preencha nome, idade, cargo e salário e clique em **Cadastrar**.
- Clique em **Editar** na linha desejada, altere os campos e clique em **Salvar alterações**. **Cancelar edição** descarta o que foi digitado.
- Clique em **Excluir** para remover o funcionário da tabela.
- Os quatro relatórios são recalculados após cada cadastro, edição ou exclusão.
- Os dados são guardados em um array em memória; recarregar a página inicia uma lista vazia. Não há banco de dados ou persistência, que não são exigidos no PDF.

## Correspondência com o enunciado

| Exercício | Implementação |
| --- | --- |
| 1 | `index.html`: formulário com os quatro tipos de campo e tabela. `funcionario.js`: classe `Funcionario`, construtor, getters/setters dos campos e `toString()`. `app.js`: array de instâncias. |
| 2 | Botões Editar e Excluir em cada linha; formulário preenchido para edição; método `atualizar()` da classe utiliza setters. Eventos `onclick` com funções anônimas. |
| 3 | `buscarFuncionario`, `removerFuncionario` e `atualizarFuncionario` são arrow functions; `find` e `filter` recebem lambdas. Exemplo de substituição ao final de `app.js` e abaixo. |
| 4 | `gerarRelatorios()` usa `filter` para salários **maiores** que 5000, `reduce` para média, `map` e `Set` para cargos únicos, e `map` para nomes em maiúsculo. |
| Ambiente | `Dockerfile`, `compose.yaml`, tarefas do VS Code e Dev Container. |

### Função anônima tradicional e arrow function

```javascript
// Função anônima tradicional:
editar.onclick = function () {
  editarFuncionario(funcionario.id);
};

// Forma equivalente neste caso, sem uso de this ou arguments:
editar.onclick = () => editarFuncionario(funcionario.id);
```

O exemplo mostra duas alternativas para o mesmo evento. A aplicação registra apenas uma delas, evitando execução duplicada.

## Testes

No container iniciado:

```sh
docker compose exec funcionarios npm test
```

Ou localmente com Node.js: `npm test`. Os testes verificam classe e validações, edição por ID, preservação do objeto, exclusão e relatórios, incluindo salário exatamente igual a 5000 e lista vazia.

## Versionamento

O código-fonte deve ser versionado com Git e compartilhado no GitHub, conforme a observação final do enunciado. Não inclua dados reais de funcionários no repositório.
