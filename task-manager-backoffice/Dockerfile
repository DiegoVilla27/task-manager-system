# Imagen base con Node.js sobre Alpine
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm@latest

# Copiar archivos de dependencias para aprovechar la caché
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias del proyecto
RUN pnpm install

# Copiar todo el código fuente del proyecto
COPY . .

# Exponer el puerto configurado en Angular (4200)
EXPOSE 4200

# Iniciar el servidor de desarrollo de Angular escuchando en todas las interfaces de red
CMD ["pnpm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
