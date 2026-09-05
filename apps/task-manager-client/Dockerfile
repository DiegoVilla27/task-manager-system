# Imagen base con Node.js sobre Alpine
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm@latest

# Copiar archivos de dependencias para aprovechar la caché
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

# Instalar dependencias del proyecto
RUN pnpm install

# Copiar todo el código fuente del proyecto
COPY . .

# Exponer el puerto configurado en Vite (3000)
EXPOSE 3000

# Iniciar el servidor de desarrollo de Vite escuchando en todas las interfaces de red
CMD ["pnpm", "run", "dev"]