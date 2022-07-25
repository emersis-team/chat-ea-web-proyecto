# chat-ea-web-pwa

## DESPLIEGUE

1. Compilar Vue: npm run build
2. Copiar todo el contenido del dist (menos el index.html) al proyecto chatea-api-front/src/main/resources/static
3. Copiar el index.html a chatea-api-front/src/main/resources/templates
4. Abrir cmd, cd a chatea-api-front y ejecutar mvn clean install
5. En la carpeta target renombrar el .war generado a ROOT.war
6. Subir el ROOT.war al servidor, en la carpeta /home/usuario/apache-tomcat-8.5.78/webapps
