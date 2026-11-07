FROM node:22-alpine
WORKDIR /app
COPY package.json server.js ./
COPY index.html styles.css funcionario.js app.js ./
EXPOSE 8080
CMD ["node", "server.js"]
