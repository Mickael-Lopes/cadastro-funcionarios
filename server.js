// Servidor de desenvolvimento sem dependências externas.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const arquivos = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
  '/funcionario.js': ['funcionario.js', 'text/javascript; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8']
};
http.createServer((req, res) => {
  const arquivo = arquivos[new URL(req.url, 'http://localhost').pathname];
  if (!arquivo || !['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(404);
    res.end('Não encontrado');
    return;
  }
  fs.readFile(path.join(__dirname, arquivo[0]), (erro, conteudo) => {
    if (erro) { res.writeHead(500); res.end('Erro ao carregar arquivo'); return; }
    res.writeHead(200, { 'Content-Type': arquivo[1], 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : conteudo);
  });
}).listen(Number(process.env.PORT) || 8080, '0.0.0.0', () => console.log(`Local: http://localhost:${Number(process.env.PORT) || 8080}`));
