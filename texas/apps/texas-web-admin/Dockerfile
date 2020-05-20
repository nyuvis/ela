FROM node
ARG API_URL

ENV REACT_APP_API_URL $API_URL

WORKDIR /app
COPY ./apps/texas-web-admin/package.json ./package.json
RUN npm install

CMD ["npm", "start"]