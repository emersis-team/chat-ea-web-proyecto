#!/bin/bash

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
