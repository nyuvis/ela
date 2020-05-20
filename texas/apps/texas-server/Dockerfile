FROM node:10

ARG API_PORT
ARG AUTH_SECRET

RUN npm install -g lerna forever

WORKDIR /app
COPY ./lerna.json ./lerna.json
COPY ./package.json ./package.json
COPY ./apps/texas-server/package.json ./apps/texas-server/package.json
COPY ./apps/texas-cli/package.json ./apps/texas-cli/package.json
COPY ./lib/texas-js/package.json ./lib/texas-js/package.json
COPY ./lib/texas-utils/package.json ./lib/texas-utils/package.json
COPY ./lib/texas-gql/package.json /app/lib/texas-gql/package.json

RUN lerna bootstrap

ENV API_PORT $API_PORT
ENV CONFIG_PATH /app/config
ENV AUTH_SECRET $AUTH_SECRET
ENV RUNTIME_ROOT /app_data

RUN npm install -g nodemon 
#WORKDIR /app/bin/texas-server

CMD ["npm", "start"]