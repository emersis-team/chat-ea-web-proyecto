#!/bin/bash

tsc
npm run build
cp -r dist/ ~/cideso/chatea-api-front/src/main/resources/
cd ~/cideso/chatea-api-front/src/main/resources/
echo "moving to middleware..."
pwd
mv dist/index.html templates/index.html
rm -r static/
mv dist/ static/

echo "Building meaven package..."
cd ~/cideso/chatea-api-front/
mvn clean package
echo "ready to updload war. "
scp ./target/chat-ea-web-0.0.1-SNAPSHOT.war Administrator@38.109.228.250:/C:/
echo "war upload to server."
echo "[WARINING]: Please enter to the server and move war file into tomcat and restart it"

