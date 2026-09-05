# Imagen base con Node.js sobre Alpine
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm@latest

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml .npmrc* ./

# Instalar dependencias del proyecto
RUN pnpm config set ignore-scripts true && pnpm install

# Copiar todo el código fuente del proyecto
COPY . .

# Exponer el puerto configurado en Angular (4200)
EXPOSE 4200

# Iniciar el servidor de desarrollo de Angular escuchando en todas las interfaces de red
CMD ["pnpm", "exec", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
