FROM node:16-alpine as node
WORKDIR /app
COPY . .
RUN npm i
EXPOSE 4000
CMD [ "node", "socketbot.mjs" ]
