FROM node:10
MAINTAINER Davin Ahn <m.davinahn@gmail.com>
RUN mkdir -p /app
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 8080

CMD npm run start
