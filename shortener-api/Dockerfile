# --- Estágio 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos os arquivos de dependências
COPY package*.json ./

# Instalamos TODAS as dependências (incluindo devDependencies para o Nest CLI funcionar)
RUN npm ci

# Copiamos o código fonte
COPY . .

# Executamos o build (Gera a pasta /dist)
RUN npm run build

# --- Estágio 2: Produção ---
FROM node:20-alpine

WORKDIR /app

# Copiamos apenas o package.json novamente
COPY package*.json ./

# Desta vez, instalamos APENAS as dependências de produção (mais leve e seguro)
RUN npm ci --only=production

# Copiamos a pasta 'dist' gerada no estágio anterior
COPY --from=builder /app/dist ./dist

# Definimos o usuário 'node' por segurança (evita rodar como root)
USER node

# Expomos a porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/main"]