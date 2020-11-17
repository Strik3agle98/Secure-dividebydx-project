FROM node:12-slim

# install deps
WORKDIR /app
COPY package*.json ./
RUN yarn
RUN yarn global add serve

# build
COPY . .
RUN yarn build

CMD serve -s build -l tcp://0.0.0.0:4000

