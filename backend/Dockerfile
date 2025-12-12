# Dockerfile para Backend con Node.js + Python
# Esto permite usar mailer.py para enviar emails vía Gmail SMTP

FROM node:18-slim

# Instalar Python 3
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3 /usr/bin/python

# Directorio de trabajo
WORKDIR /app

# Copiar package.json primero (para cache de dependencias)
COPY package*.json ./

# Instalar dependencias de Node
RUN npm install --production

# Copiar resto del código
COPY . .

# Puerto
EXPOSE 10000

# Comando de inicio
CMD ["npm", "start"]
