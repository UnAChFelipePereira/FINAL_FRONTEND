FROM node:18

# Copiar el archivo package.json al directorio /usr/src/
COPY ["package.json",   "/usr/src/"]

# Establecer el directorio de trabajo como /usr/src/
WORKDIR /usr/src

# Eliminar la carpeta node_modules (si existe)
RUN rm -rf /usr/src/node_modules

# Instalar una versión específica de npm
#RUN npm install -g npm@9
RUN npm install -g npm@9
# Limpiar la caché de npm
RUN npm cache clean --force

# Desactivar la auditoría de npm
RUN npm set audit false

# Desinstalar angular-cli y @angular/cli (si están instalados)
RUN npm uninstall -g angular-cli
RUN npm uninstall -g @angular/cli

# Limpiar la caché de npm nuevamente
RUN npm cache clean --force

# Instalar una versión específica de @angular/cli
RUN npm install -g @angular/cli@17.0.2

# Instalar las dependencias del proyecto
RUN npm install --force

#RUN ng generate service api

#RUN npm install rxjs @angular/common @angular/core @angular/http @angular/router --save


#RUN npm init --force
# Copiar todos los archivos del proyecto al directorio de trabajo en la imagen
COPY [".", "/usr/src/"]

# Exponer el puerto 4200
EXPOSE 4200
