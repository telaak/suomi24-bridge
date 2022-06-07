FROM node:16-alpine as node
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 4000
CMD [ "node", "socketbot.mjs" ]
