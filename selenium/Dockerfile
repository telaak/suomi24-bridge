FROM node:16-alpine as node
WORKDIR /app
RUN npm i -g selenium-side-runner
COPY . .
CMD ["/bin/sh", "-c", "sed -i -e \"s|SED_USERNAME|$USERNAME|g\" -e \"s|SED_PASSWORD|$PASSWORD|g\" S24.side && selenium-side-runner S24.side --server http://standalone-firefox:4444/wd/hub -c \"browserName='firefox' pageLoadStrategy='eager'\""]