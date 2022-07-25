FROM node:10.19.0

WORKDIR /usr/src/chatea
COPY package.json ./
RUN npm install -g npm@6.14.4
RUN npm install

COPY . ./

CMD ["npm", "run", "build"]
CMD ["npm", "run", "serve"]
