FROM node:22.3.0-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5000

EXPOSE $PORT

CMD [ "node", "server.js" ]