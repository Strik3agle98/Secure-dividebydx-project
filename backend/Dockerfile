FROM node:12-slim

WORKDIR /app

# install deps
COPY package.json yarn.lock ./
RUN yarn 

# copy code
COPY . .
# build TS -> JS
RUN yarn build

CMD node dist/index.js
