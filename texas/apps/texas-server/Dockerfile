FROM node:10

ARG API_PORT
ARG AUTH_SECRET

RUN npm install -g lerna forever

WORKDIR /app
COPY ./lerna.json ./lerna.json
COPY ./package.json ./package.json
COPY ./config ./config
COPY ./apps/texas-server ./apps/texas-server
COPY ./apps/texas-cli ./apps/texas-cli
COPY ./lib/texas-js ./lib/texas-js
COPY ./lib/texas-utils ./lib/texas-utils
COPY ./lib/texas-gql ./lib/texas-gql

RUN lerna bootstrap

ENV API_PORT $API_PORT
ENV CONFIG_PATH /app/config
ENV AUTH_SECRET $AUTH_SECRET
ENV RUNTIME_ROOT /app_data

RUN npm install -g nodemon 
#WORKDIR /app/bin/texas-server

CMD ["npm", "start"]