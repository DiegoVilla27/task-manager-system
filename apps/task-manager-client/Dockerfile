# Imagen base con Node.js sobre Alpine
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm@latest

# Copiar archivos de dependencias y workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY libs/api-types ./libs/api-types
COPY apps/task-manager-client/package.json ./apps/task-manager-client/

# Instalar dependencias del proyecto
RUN pnpm install --filter task-manager-client...

# Copiar todo el código fuente del proyecto
COPY apps/task-manager-client ./apps/task-manager-client

# Directorio de la aplicación
WORKDIR /app/apps/task-manager-client

# Exponer el puerto configurado en Vite (3000)
EXPOSE 3000

# Iniciar el servidor de desarrollo de Vite escuchando en todas las interfaces de red
CMD ["pnpm", "run", "dev"]